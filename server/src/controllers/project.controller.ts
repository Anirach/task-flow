import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listProjects(_req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.listProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.getProject(req.params.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, color, description, memberIds } = req.body;
    if (!name) {
      throw new AppError(400, 'VALIDATION_ERROR', 'name is required');
    }
    const project = await projectService.createProject(
      { name, color: color || '#1A73E8', description: description || '', memberIds: memberIds || [] },
      req.user!.id,
    );
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
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
    if (!name) {
      throw new AppError(400, 'VALIDATION_ERROR', 'column name is required');
    }
    const project = await projectService.addColumn(req.params.id, name);
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
    const project = await projectService.reorderColumns(req.params.id, columns);
    res.json(project);
  } catch (err) {
    next(err);
  }
}
