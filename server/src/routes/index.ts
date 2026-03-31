import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';
import { projectRoutes } from './project.routes.js';
import { taskRoutes } from './task.routes.js';
import { commentRoutes } from './comment.routes.js';
import { notificationRoutes } from './notification.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/tasks', commentRoutes);       // /tasks/:taskId/comments
router.use('/notifications', notificationRoutes);

export { router as routes };
