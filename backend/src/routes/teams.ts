import { Router } from 'express';
import {
  registerTeam,
  joinTeam,
  leaveTeam,
  getTeamsByUser,
  getTeamsByHackathon,
  updateTeam,
} from '../controllers/teamController';
import { authenticateToken, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const registerTeamSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  hackathonId: Joi.number().integer().positive().required(),
});

const updateTeamSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
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

// Team registration and management routes (require authentication)
router.post('/register', 
  authenticateToken,
  requireRole(['participant']), 
  validateRequest(registerTeamSchema), 
  registerTeam
);

router.post('/:id/join', 
  authenticateToken,
  requireRole(['participant']), 
  joinTeam
);

router.delete('/:id/leave', 
  authenticateToken,
  requireRole(['participant']), 
  leaveTeam
);

router.put('/:id', 
  authenticateToken,
  requireRole(['participant']), 
  validateRequest(updateTeamSchema), 
  updateTeam
);

// Query routes
router.get('/user/:userId', getTeamsByUser);
router.get('/hackathon/:hackathonId', getTeamsByHackathon);

export default router;
