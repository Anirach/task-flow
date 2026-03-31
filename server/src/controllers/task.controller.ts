import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service.js';
import { AppError } from '../middleware/errorHandler.js';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

function validateTaskInput(data: any) {
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0 || data.title.length > 500) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Title must be 1-500 characters');
    }
  }
  if (data.description !== undefined && typeof data.description === 'string' && data.description.length > 5000) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Description must be under 5000 characters');
  }
  if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Priority must be Low, Medium, or High');
  }
  if (data.labels !== undefined) {
    if (!Array.isArray(data.labels) || data.labels.length > 20) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Labels must be an array of max 20 items');
    }
    for (const l of data.labels) {
      if (typeof l !== 'string' || l.length > 50) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Each label must be under 50 characters');
      }
    }
  }
}

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
    validateTaskInput({ title, description, priority, labels });
    const task = await taskService.createTask(
      { projectId, title: title.trim(), description: description?.trim(), status, priority, assigneeId, dueDate, labels },
      req.user!.id,
    );
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    validateTaskInput(req.body);
    const task = await taskService.updateTask(req.params.id, req.body, req.user!.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function moveTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    if (!status || typeof status !== 'string' || status.length > 50) {
      throw new AppError(400, 'VALIDATION_ERROR', 'status is required and must be under 50 characters');
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
