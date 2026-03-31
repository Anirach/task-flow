import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', notificationController.listNotifications);
router.patch('/:id/read', notificationController.markAsRead);

export { router as notificationRoutes };
