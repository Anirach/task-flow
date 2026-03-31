import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, avatar, role } = req.body;
    if (!name || !email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'name, email, and password are required');
    }
    const result = await authService.register({ name, email, password, avatar, role });
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
    const result = await authService.login(email, password);
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
    const user = await authService.updateProfile(req.user!.id, req.body);
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
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}
