import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service.js';

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await notificationService.listNotifications(req.user!.id);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await notificationService.markAsRead(req.params.id, req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
