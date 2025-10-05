import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ 
        error: 'Validation error', 
        details: errorMessage 
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('participant', 'organizer', 'judge', 'mentor').required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createHackathon: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    org: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(5000),
    tags: Joi.array().items(Joi.string()),
    prize: Joi.string().max(255),
    dateRange: Joi.string().max(255),
    startAt: Joi.number().integer(),
    endAt: Joi.number().integer(),
    criteria: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        label: Joi.string().required(),
        max: Joi.number().integer().min(1).required(),
      })
    ),
  }),

  createTeam: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    hackathonId: Joi.string().uuid().required(),
  }),

  createSubmission: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(5000),
    repoUrl: Joi.string().uri(),
    figmaUrl: Joi.string().uri(),
    driveUrl: Joi.string().uri(),
    deckUrl: Joi.string().uri(),
  }),

  createEvaluation: Joi.object({
    scores: Joi.array().items(
      Joi.object({
        criterionId: Joi.string().required(),
        score: Joi.number().min(0).required(),
      })
    ).required(),
    feedback: Joi.string().max(2000),
  }),
};
