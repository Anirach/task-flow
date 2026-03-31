import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'In Review', 'Done'];

async function transformProject(project: any) {
  const columns = (project.columns || [])
    .sort((a: any, b: any) => a.order - b.order)
    .map((c: any) => c.name);

  const memberIds = (project.members || []).map((m: any) => m.userId);

  const taskCount = project._count?.tasks ?? 0;

  // Compute completedCount: tasks whose status matches last column
  const doneStatus = columns[columns.length - 1];
  let completedCount = 0;
  if (doneStatus && taskCount > 0) {
    completedCount = await prisma.task.count({
      where: { projectId: project.id, status: doneStatus },
    });
  }

  return {
    id: project.id,
    name: project.name,
    color: project.color,
    description: project.description,
    memberIds,
    columns,
    createdAt: project.createdAt.toISOString(),
    taskCount,
    completedCount,
  };
}

const projectInclude = {
  columns: { orderBy: { order: 'asc' as const } },
  members: { select: { userId: true } },
  _count: { select: { tasks: true } },
};

export async function listProjects() {
  const projects = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { createdAt: 'desc' },
  });
  return Promise.all(projects.map(transformProject));
}

export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');
  return transformProject(project);
}

export async function createProject(data: {
  name: string;
  color: string;
  description: string;
  memberIds: string[];
}, currentUserId: string) {
  // Ensure current user is included in members
  const memberIds = Array.from(new Set([currentUserId, ...data.memberIds]));

  const project = await prisma.project.create({
    data: {
      name: data.name,
      color: data.color,
      description: data.description,
      columns: {
        create: DEFAULT_COLUMNS.map((name, order) => ({ name, order })),
      },
      members: {
        create: memberIds.map((userId) => ({ userId })),
      },
    },
    include: projectInclude,
  });

  return transformProject(project);
}

export async function updateProject(id: string, data: {
  name?: string;
  color?: string;
  description?: string;
  memberIds?: string[];
}) {
  const existing = await prisma.project.findUnique({
    where: { id },
    include: { members: true },
  });
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  // Update basic fields
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.description !== undefined) updateData.description = data.description;

  await prisma.project.update({ where: { id }, data: updateData });

  // Sync members if provided
  if (data.memberIds) {
    const currentIds = existing.members.map((m) => m.userId);
    const newIds = data.memberIds;

    const toRemove = currentIds.filter((uid) => !newIds.includes(uid));
    const toAdd = newIds.filter((uid) => !currentIds.includes(uid));

    if (toRemove.length > 0) {
      await prisma.projectMember.deleteMany({
        where: { projectId: id, userId: { in: toRemove } },
      });
    }
    if (toAdd.length > 0) {
      await prisma.projectMember.createMany({
        data: toAdd.map((userId) => ({ projectId: id, userId })),
      });
    }
  }

  // Refetch and return
  const updated = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  return transformProject(updated!);
}

export async function deleteProject(id: string) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  await prisma.project.delete({ where: { id } });
}

export async function addColumn(projectId: string, name: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { columns: true },
  });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const existingNames = project.columns.map((c) => c.name);
  if (existingNames.includes(name)) {
    throw new AppError(409, 'CONFLICT', 'Column name already exists');
  }

  const maxOrder = project.columns.reduce((max, c) => Math.max(max, c.order), -1);

  await prisma.projectColumn.create({
    data: { name, order: maxOrder + 1, projectId },
  });

  return getProject(projectId);
}

export async function reorderColumns(projectId: string, columns: string[]) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { columns: true },
  });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  // Update each column's order to match the array index
  await prisma.$transaction(
    columns.map((name, order) =>
      prisma.projectColumn.updateMany({
        where: { projectId, name },
        data: { order },
      })
    )
  );

  return getProject(projectId);
}
