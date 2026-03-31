import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listComments(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await commentService.listComments(req.params.taskId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { text } = req.body;
    if (!text) {
      throw new AppError(400, 'VALIDATION_ERROR', 'text is required');
    }
    const comment = await commentService.createComment(req.params.taskId, text, req.user!.id);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}
