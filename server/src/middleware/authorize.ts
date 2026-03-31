import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from './errorHandler.js';

/**
 * Middleware that checks the user's role in a project.
 * Extracts projectId from params.id, body.projectId, or by looking up a task.
 */
export function requireProjectRole(...allowedRoles: string[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');

      let projectId = req.params.id || req.body?.projectId;

      // For task routes — look up task to get projectId
      if (!projectId && req.params.taskId) {
        const task = await prisma.task.findUnique({ where: { id: req.params.taskId }, select: { projectId: true } });
        if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');
        projectId = task.projectId;
      }

      // For task PATCH/DELETE by :id where it's a task id, not project id
      if (!projectId && req.params.id) {
        const task = await prisma.task.findUnique({ where: { id: req.params.id }, select: { projectId: true } });
        if (task) {
          projectId = task.projectId;
        }
      }

      if (!projectId) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Could not determine project');
      }

      const membership = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      if (!membership) {
        throw new AppError(403, 'FORBIDDEN', 'You are not a member of this project');
      }

      if (!allowedRoles.includes(membership.role)) {
        throw new AppError(403, 'FORBIDDEN', 'You do not have permission for this action');
      }

      req.projectRole = membership.role;
      next();
    } catch (err) {
      next(err);
    }
  };
}
