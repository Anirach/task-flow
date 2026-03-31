import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service.js';
import { AppError } from '../middleware/errorHandler.js';

const COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export async function listProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.listProjects(req.user!.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.getProject(req.params.id, req.user!.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, color, description, memberIds } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Project name must be 1-200 characters');
    }
    if (color && !COLOR_REGEX.test(color)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Color must be a valid hex code (e.g. #1A73E8)');
    }
    if (description && (typeof description !== 'string' || description.length > 2000)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Description must be under 2000 characters');
    }
    const project = await projectService.createProject(
      { name: name.trim(), color: color || '#1A73E8', description: description?.trim() || '', memberIds: memberIds || [] },
      req.user!.id,
    );
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user!.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function addColumn(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 50) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Column name must be 1-50 characters');
    }
    const project = await projectService.addColumn(req.params.id, name, req.user!.id);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function reorderColumns(req: Request, res: Response, next: NextFunction) {
  try {
    const { columns } = req.body;
    if (!Array.isArray(columns)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'columns must be an array of strings');
    }
    const project = await projectService.reorderColumns(req.params.id, columns, req.user!.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}
