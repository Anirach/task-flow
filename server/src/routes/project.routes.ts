import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/columns', projectController.addColumn);
router.put('/:id/columns', projectController.reorderColumns);

export { router as projectRoutes };
