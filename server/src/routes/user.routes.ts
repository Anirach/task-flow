import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, userController.listUsers);

export { router as userRoutes };
