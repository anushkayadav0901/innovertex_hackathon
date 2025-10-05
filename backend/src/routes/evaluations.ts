import { Router } from 'express';
import {
  createEvaluation,
  getEvaluationsBySubmission,
  getEvaluationsByJudge,
  getLeaderboard,
  updateEvaluation,
} from '../controllers/evaluationController';
import { authenticateToken, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createEvaluationSchema = Joi.object({
  hackathonId: Joi.number().integer().positive().required(),
  submissionId: Joi.number().integer().positive().required(),
  scores: Joi.object().pattern(
    Joi.string(),
    Joi.number().min(0).max(10)
  ).required(),
  feedback: Joi.string().max(5000).optional(),
});

const updateEvaluationSchema = Joi.object({
  scores: Joi.object().pattern(
    Joi.string(),
    Joi.number().min(0).max(10)
  ).optional(),
  feedback: Joi.string().max(5000).optional(),
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
router.get('/leaderboard/:hackathonId', getLeaderboard);
router.get('/submission/:id', getEvaluationsBySubmission);

// Protected routes (judges only)
router.post('/', 
  authenticateToken,
  requireRole(['judge']), 
  validateRequest(createEvaluationSchema), 
  createEvaluation
);

router.put('/:id', 
  authenticateToken,
  requireRole(['judge']), 
  validateRequest(updateEvaluationSchema), 
  updateEvaluation
);

// Query routes for judges
router.get('/judge/:judgeId/hackathon/:hackathonId', 
  authenticateToken,
  requireRole(['judge']), 
  getEvaluationsByJudge
);

export default router;
