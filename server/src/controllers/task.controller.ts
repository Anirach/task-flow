import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await taskService.listTasks(
      req.query as Record<string, string>,
      req.user!.id,
    );
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.getTask(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, title, description, status, priority, assigneeId, dueDate, labels } = req.body;
    if (!projectId || !title || !status) {
      throw new AppError(400, 'VALIDATION_ERROR', 'projectId, title, and status are required');
    }
    const task = await taskService.createTask(
      { projectId, title, description, status, priority, assigneeId, dueDate, labels },
      req.user!.id,
    );
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user!.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function moveTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    if (!status) {
      throw new AppError(400, 'VALIDATION_ERROR', 'status is required');
    }
    const task = await taskService.moveTask(req.params.id, status);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
