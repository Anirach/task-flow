import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return notifications.map((n) => ({
    id: n.id,
    userId: n.userId,
    type: n.type,
    message: n.message,
    taskId: n.taskId,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function markAsRead(id: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  if (notification.userId !== userId) throw new AppError(404, 'NOT_FOUND', 'Notification not found');

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return { id: updated.id, isRead: updated.isRead };
}
