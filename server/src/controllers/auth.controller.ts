import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { AppError } from '../middleware/errorHandler.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'name, email, and password are required');
    }
    if (typeof name !== 'string' || name.length > 100) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Name must be 1-100 characters');
    }
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email format');
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Password must be 8-128 characters');
    }
    const result = await authService.register({ name: name.trim(), email: email.trim().toLowerCase(), password, avatar });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'email and password are required');
    }
    if (typeof email !== 'string' || typeof password !== 'string' || password.length > 128) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid credentials');
    }
    const result = await authService.login(email.trim().toLowerCase(), password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0 || name.length > 100)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Name must be 1-100 characters');
    }
    const user = await authService.updateProfile(req.user!.id, { name: name?.trim() });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError(400, 'VALIDATION_ERROR', 'currentPassword and newPassword are required');
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 128) {
      throw new AppError(400, 'VALIDATION_ERROR', 'New password must be 8-128 characters');
    }
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}
