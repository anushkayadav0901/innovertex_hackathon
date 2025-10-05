import { Router } from 'express';
import {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
} from '../controllers/hackathonController';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createHackathonSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  org: Joi.string().min(2).max(255).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  prize: Joi.string().max(255).optional(),
  description: Joi.string().max(5000).optional(),
  criteria: Joi.array().items(Joi.object()).default([]),
  dateRange: Joi.string().optional(),
  startAt: Joi.number().optional(),
  endAt: Joi.number().optional(),
});

const updateHackathonSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  org: Joi.string().min(2).max(255).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  prize: Joi.string().max(255).optional(),
  description: Joi.string().max(5000).optional(),
  criteria: Joi.array().items(Joi.object()).optional(),
  dateRange: Joi.string().optional(),
  startAt: Joi.number().optional(),
  endAt: Joi.number().optional(),
});

// Validation middleware
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

// Public routes
router.get('/', optionalAuth, getAllHackathons);
router.get('/:id', optionalAuth, getHackathonById);

// Protected routes (organizer only)
router.post('/', 
  authenticateToken, 
  requireRole(['organizer']), 
  validateRequest(createHackathonSchema), 
  createHackathon
);

router.put('/:id', 
  authenticateToken, 
  requireRole(['organizer']), 
  validateRequest(updateHackathonSchema), 
  updateHackathon
);

router.delete('/:id', 
  authenticateToken, 
  requireRole(['organizer']), 
  deleteHackathon
);

export default router;
