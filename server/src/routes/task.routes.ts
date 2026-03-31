import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireProjectRole } from '../middleware/authorize.js';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.post('/', requireProjectRole('Admin', 'Member'), taskController.createTask);
router.patch('/:id', requireProjectRole('Admin', 'Member'), taskController.updateTask);
router.patch('/:id/move', requireProjectRole('Admin', 'Member'), taskController.moveTask);
router.delete('/:id', requireProjectRole('Admin', 'Member'), taskController.deleteTask);

export { router as taskRoutes };
