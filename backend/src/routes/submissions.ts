import { Router } from 'express';
import {
  createSubmission,
  getSubmissionsByHackathon,
  getSubmissionsByTeam,
  updateSubmission,
  deleteSubmission,
} from '../controllers/submissionController';
import { authenticateToken, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createSubmissionSchema = Joi.object({
  hackathonId: Joi.number().integer().positive().required(),
  teamId: Joi.number().integer().positive().required(),
  title: Joi.string().min(3).max(255).required(),
  repoUrl: Joi.string().uri().optional().allow(''),
  figmaUrl: Joi.string().uri().pattern(/^https:\/\/(www\.)?figma\.com\//).optional().allow(''),
  driveUrl: Joi.string().uri().pattern(/^https:\/\/(drive\.google\.com|www\.dropbox\.com)\//).optional().allow(''),
  deckUrl: Joi.string().uri().optional().allow(''),
  description: Joi.string().max(5000).optional(),
});

const updateSubmissionSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  repoUrl: Joi.string().uri().optional().allow(''),
  figmaUrl: Joi.string().uri().pattern(/^https:\/\/(www\.)?figma\.com\//).optional().allow(''),
  driveUrl: Joi.string().uri().pattern(/^https:\/\/(drive\.google\.com|www\.dropbox\.com)\//).optional().allow(''),
  deckUrl: Joi.string().uri().optional().allow(''),
  description: Joi.string().max(5000).optional(),
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

// Public routes (for viewing submissions)
router.get('/hackathon/:id', getSubmissionsByHackathon);
router.get('/team/:id', getSubmissionsByTeam);

// Protected routes (require authentication)
router.post('/', 
  authenticateToken,
  requireRole(['participant']), 
  validateRequest(createSubmissionSchema), 
  createSubmission
);

router.put('/:id', 
  authenticateToken,
  requireRole(['participant']), 
  validateRequest(updateSubmissionSchema), 
  updateSubmission
);

router.delete('/:id', 
  authenticateToken,
  requireRole(['participant']), 
  deleteSubmission
);

export default router;
