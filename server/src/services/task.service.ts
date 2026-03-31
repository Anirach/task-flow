import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

function transformTask(task: any) {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    reporterId: task.reporterId,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    labels: JSON.parse(task.labels || '[]'),
    commentCount: task._count?.comments ?? 0,
    attachmentCount: 0,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function listTasks(filters: {
  projectId?: string;
  assigneeId?: string;
  priority?: string;
  search?: string;
  overdue?: string;
}, currentUserId: string) {
  const where: Prisma.TaskWhereInput = {};

  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.assigneeId) {
    where.assigneeId = filters.assigneeId === 'me' ? currentUserId : filters.assigneeId;
  }
  if (filters.priority) where.priority = filters.priority;

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.overdue === 'true') {
    // Overdue = dueDate < now AND status is not the last column of its project
    // We handle this with post-filtering since it requires project-specific logic
    where.dueDate = { lt: new Date() };
  }

  const tasks = await prisma.task.findMany({
    where,
    include: { _count: { select: { comments: true } } },
    orderBy: { createdAt: 'desc' },
  });

  let result = tasks.map(transformTask);

  // Post-filter overdue: exclude tasks in their project's last column
  if (filters.overdue === 'true') {
    const projectIds = [...new Set(result.map((t) => t.projectId))];
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      include: { columns: { orderBy: { order: 'asc' } } },
    });
    const doneStatusMap = new Map<string, string>();
    for (const p of projects) {
      const lastCol = p.columns[p.columns.length - 1];
      if (lastCol) doneStatusMap.set(p.id, lastCol.name);
    }
    result = result.filter((t) => t.status !== doneStatusMap.get(t.projectId));
  }

  return result;
}

export async function getTask(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      _count: { select: { comments: true } },
      comments: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const transformed = transformTask(task);
  return {
    ...transformed,
    comments: task.comments.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      authorId: c.authorId,
      text: c.text,
      createdAt: c.createdAt.toISOString(),
      author: c.author,
    })),
  };
}

export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string | null;
  dueDate?: string | null;
  labels?: string[];
}, reporterId: string) {
  // Validate project exists
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    include: { columns: true },
  });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority || 'Medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      labels: JSON.stringify(data.labels || []),
      projectId: data.projectId,
      assigneeId: data.assigneeId || null,
      reporterId,
    },
    include: { _count: { select: { comments: true } } },
  });

  // Create notification if assigned to someone other than reporter
  if (data.assigneeId && data.assigneeId !== reporterId) {
    const reporter = await prisma.user.findUnique({ where: { id: reporterId }, select: { name: true } });
    await prisma.notification.create({
      data: {
        type: 'task_assigned',
        message: `${reporter?.name || 'Someone'} assigned you to '${data.title}'`,
        userId: data.assigneeId,
        taskId: task.id,
      },
    });
  }

  return transformTask(task);
}

export async function updateTask(id: string, data: {
  title?: string;
  description?: string;
  priority?: string;
  assigneeId?: string | null;
  dueDate?: string | null;
  labels?: string[];
}, currentUserId: string) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId || null;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.labels !== undefined) updateData.labels = JSON.stringify(data.labels);

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
    include: { _count: { select: { comments: true } } },
  });

  // Notify if assignee changed to a new person
  if (data.assigneeId && data.assigneeId !== existing.assigneeId && data.assigneeId !== currentUserId) {
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, select: { name: true } });
    await prisma.notification.create({
      data: {
        type: 'task_assigned',
        message: `${currentUser?.name || 'Someone'} assigned you to '${task.title}'`,
        userId: data.assigneeId,
        taskId: task.id,
      },
    });
  }

  return transformTask(task);
}

export async function moveTask(id: string, status: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { columns: true } } },
  });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const validStatuses = task.project.columns.map((c) => c.name);
  if (!validStatuses.includes(status)) {
    throw new AppError(400, 'VALIDATION_ERROR', `Invalid status '${status}'. Valid: ${validStatuses.join(', ')}`);
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { status },
    include: { _count: { select: { comments: true } } },
  });

  return transformTask(updated);
}

export async function deleteTask(id: string) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  await prisma.task.delete({ where: { id } });
}
