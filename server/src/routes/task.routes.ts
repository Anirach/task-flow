import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.patch('/:id/move', taskController.moveTask);
router.delete('/:id', taskController.deleteTask);

export { router as taskRoutes };
