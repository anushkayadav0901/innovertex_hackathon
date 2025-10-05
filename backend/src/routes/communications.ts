import { Router } from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  createFAQ,
  getFAQs,
  createQuestion,
  answerQuestion,
  getQuestions,
  getMessages,
} from '../controllers/communicationController';
import { authenticateToken, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createAnnouncementSchema = Joi.object({
  hackathonId: Joi.number().integer().positive().required(),
  title: Joi.string().min(3).max(255).required(),
  content: Joi.string().min(10).max(5000).required(),
  priority: Joi.string().valid('high', 'normal', 'low').optional(),
});

const createFAQSchema = Joi.object({
  hackathonId: Joi.number().integer().positive().required(),
  question: Joi.string().min(10).max(1000).required(),
  answer: Joi.string().min(10).max(5000).required(),
});

const createQuestionSchema = Joi.object({
  hackathonId: Joi.number().integer().positive().required(),
  question: Joi.string().min(10).max(1000).required(),
});

const answerQuestionSchema = Joi.object({
  answer: Joi.string().min(10).max(5000).required(),
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
router.get('/announcements/:hackathonId', getAnnouncements);
router.get('/faqs/:hackathonId', getFAQs);
router.get('/questions/:hackathonId', getQuestions);
router.get('/messages/:hackathonId', getMessages);

// Protected routes - Announcements (organizer only)
router.post('/announcements', 
  authenticateToken,
  requireRole(['organizer']), 
  validateRequest(createAnnouncementSchema), 
  createAnnouncement
);

// Protected routes - FAQs (organizer only)
router.post('/faqs', 
  authenticateToken,
  requireRole(['organizer']), 
  validateRequest(createFAQSchema), 
  createFAQ
);

// Protected routes - Questions (any authenticated user)
router.post('/questions', 
  authenticateToken,
  validateRequest(createQuestionSchema), 
  createQuestion
);

// Protected routes - Answer questions (organizer only)
router.post('/questions/:id/answer', 
  authenticateToken,
  requireRole(['organizer']), 
  validateRequest(answerQuestionSchema), 
  answerQuestion
);

export default router;
