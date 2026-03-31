import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireProjectRole } from '../middleware/authorize.js';

const router = Router();

router.use(authMiddleware);

router.get('/:taskId/comments', commentController.listComments);
router.post('/:taskId/comments', requireProjectRole('Admin', 'Member'), commentController.createComment);

export { router as commentRoutes };
