import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'In Review', 'Done'];

function transformProject(project: any, currentUserId?: string, completedCountOverride?: number) {
  const columns = (project.columns || [])
    .sort((a: any, b: any) => a.order - b.order)
    .map((c: any) => c.name);

  const memberIds = (project.members || []).map((m: any) => m.userId);
  const memberRoles: Record<string, string> = {};
  for (const m of project.members || []) {
    memberRoles[m.userId] = m.role;
  }

  const taskCount = project._count?.tasks ?? 0;
  const completedCount = completedCountOverride ?? 0;

  let userRole: string | undefined;
  if (currentUserId) {
    const membership = (project.members || []).find((m: any) => m.userId === currentUserId);
    userRole = membership?.role;
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
    userRole,
    memberRoles,
  };
}

/** Batch-compute completedCount for multiple projects in a single query */
async function batchCompletedCounts(projects: any[]): Promise<Map<string, number>> {
  const doneConditions: { projectId: string; doneStatus: string }[] = [];
  for (const p of projects) {
    const cols = (p.columns || []).sort((a: any, b: any) => a.order - b.order);
    const lastCol = cols[cols.length - 1];
    if (lastCol && (p._count?.tasks ?? 0) > 0) {
      doneConditions.push({ projectId: p.id, doneStatus: lastCol.name });
    }
  }

  if (doneConditions.length === 0) return new Map();

  // Single query: count tasks per project where status matches done column
  const counts = await prisma.task.groupBy({
    by: ['projectId'],
    where: {
      OR: doneConditions.map((c) => ({ projectId: c.projectId, status: c.doneStatus })),
    },
    _count: true,
  });

  const map = new Map<string, number>();
  for (const row of counts) {
    map.set(row.projectId, row._count);
  }
  return map;
}

const projectInclude = {
  columns: { orderBy: { order: 'asc' as const } },
  members: { select: { userId: true, role: true } },
  _count: { select: { tasks: true } },
};

export async function listProjects(currentUserId: string) {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: currentUserId } } },
    include: projectInclude,
    orderBy: { createdAt: 'desc' },
  });
  const completedMap = await batchCompletedCounts(projects);
  return projects.map((p) => transformProject(p, currentUserId, completedMap.get(p.id) ?? 0));
}

export async function getProject(id: string, currentUserId?: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');
  const completedMap = await batchCompletedCounts([project]);
  return transformProject(project, currentUserId, completedMap.get(id) ?? 0);
}

export async function createProject(data: {
  name: string;
  color: string;
  description: string;
  memberIds: string[];
}, currentUserId: string) {
  // Ensure current user is included in members
  const allMemberIds = Array.from(new Set([currentUserId, ...data.memberIds]));

  const project = await prisma.project.create({
    data: {
      name: data.name,
      color: data.color,
      description: data.description,
      columns: {
        create: DEFAULT_COLUMNS.map((name, order) => ({ name, order })),
      },
      members: {
        create: allMemberIds.map((userId) => ({
          userId,
          role: userId === currentUserId ? 'Admin' : 'Member',
        })),
      },
    },
    include: projectInclude,
  });

  return transformProject(project, currentUserId);
}

export async function updateProject(id: string, data: {
  name?: string;
  color?: string;
  description?: string;
  memberIds?: string[];
  members?: { userId: string; role: string }[];
}, currentUserId?: string) {
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

  // Sync members with roles if full members array provided
  if (data.members) {
    const currentIds = existing.members.map((m) => m.userId);
    const newIds = data.members.map((m) => m.userId);

    const toRemove = currentIds.filter((uid) => !newIds.includes(uid));
    const toAdd = data.members.filter((m) => !currentIds.includes(m.userId));
    const toUpdate = data.members.filter((m) => currentIds.includes(m.userId));

    if (toRemove.length > 0) {
      await prisma.projectMember.deleteMany({
        where: { projectId: id, userId: { in: toRemove } },
      });
    }
    if (toAdd.length > 0) {
      await prisma.projectMember.createMany({
        data: toAdd.map((m) => ({ projectId: id, userId: m.userId, role: m.role || 'Member' })),
      });
    }
    for (const m of toUpdate) {
      await prisma.projectMember.updateMany({
        where: { projectId: id, userId: m.userId },
        data: { role: m.role },
      });
    }
  } else if (data.memberIds) {
    // Legacy format — preserve existing roles, new members get "Member"
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
        data: toAdd.map((userId) => ({ projectId: id, userId, role: 'Member' })),
      });
    }
  }

  // Refetch and return
  const updated = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  return transformProject(updated!, currentUserId);
}

export async function deleteProject(id: string) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  await prisma.project.delete({ where: { id } });
}

export async function addColumn(projectId: string, name: string, currentUserId?: string) {
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

  return getProject(projectId, currentUserId);
}

export async function reorderColumns(projectId: string, columns: string[], currentUserId?: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { columns: true },
  });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  await prisma.$transaction(
    columns.map((name, order) =>
      prisma.projectColumn.updateMany({
        where: { projectId, name },
        data: { order },
      })
    )
  );

  return getProject(projectId, currentUserId);
}
