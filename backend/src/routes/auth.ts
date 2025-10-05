import { Router } from 'express';
import { signup, login, logout, me } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('participant', 'organizer', 'judge', 'mentor').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
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
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, me);

export default router;
