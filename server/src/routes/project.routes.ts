import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireProjectRole } from '../middleware/authorize.js';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.listProjects);
router.get('/:id', requireProjectRole('Admin', 'Member', 'Viewer'), projectController.getProject);
router.post('/', projectController.createProject);
router.patch('/:id', requireProjectRole('Admin'), projectController.updateProject);
router.delete('/:id', requireProjectRole('Admin'), projectController.deleteProject);
router.post('/:id/columns', requireProjectRole('Admin'), projectController.addColumn);
router.put('/:id/columns', requireProjectRole('Admin'), projectController.reorderColumns);

export { router as projectRoutes };
