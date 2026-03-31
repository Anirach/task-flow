import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listComments(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const comments = await prisma.comment.findMany({
    where: { taskId },
    include: { author: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return comments.map((c) => ({
    id: c.id,
    taskId: c.taskId,
    authorId: c.authorId,
    text: c.text,
    createdAt: c.createdAt.toISOString(),
    author: c.author,
  }));
}

export async function createComment(taskId: string, text: string, authorId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const comment = await prisma.comment.create({
    data: { text, taskId, authorId },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });

  // Notify task assignee if different from comment author
  if (task.assigneeId && task.assigneeId !== authorId) {
    const author = await prisma.user.findUnique({ where: { id: authorId }, select: { name: true } });
    await prisma.notification.create({
      data: {
        type: 'comment_added',
        message: `${author?.name || 'Someone'} commented on '${task.title}'`,
        userId: task.assigneeId,
        taskId,
      },
    });
  }

  return {
    id: comment.id,
    taskId: comment.taskId,
    authorId: comment.authorId,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
    author: comment.author,
  };
}
