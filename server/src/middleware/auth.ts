import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHORIZED', 'Missing or invalid token');
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, avatar: true, role: true },
    });

    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError(401, 'UNAUTHORIZED', 'Invalid token'));
    }
  }
}
