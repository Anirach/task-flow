import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/:taskId/comments', commentController.listComments);
router.post('/:taskId/comments', commentController.createComment);

export { router as commentRoutes };
