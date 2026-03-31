import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

// Simple in-memory user cache (TTL: 60s)
const userCache = new Map<string, { user: any; expiry: number }>();
const CACHE_TTL = 60_000;

async function getCachedUser(userId: string) {
  const cached = userCache.get(userId);
  if (cached && cached.expiry > Date.now()) return cached.user;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatar: true, role: true },
  });

  if (user) {
    userCache.set(userId, { user, expiry: Date.now() + CACHE_TTL });
  }
  return user;
}

export function invalidateUserCache(userId: string) {
  userCache.delete(userId);
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHORIZED', 'Missing or invalid token');
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

    const user = await getCachedUser(decoded.userId);
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
