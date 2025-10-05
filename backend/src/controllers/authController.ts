import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/config';
import { AuthRequest } from '../middleware/auth';

// Password-less signup (email only)
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    // Validate role
    const validRoles = ['participant', 'organizer', 'judge', 'mentor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be one of: participant, organizer, judge, mentor' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user without password
    const user = await User.create({
      name,
      email,
      passwordHash: '', // Empty password hash for password-less auth
      role,
      expertise: [],
      badges: [],
    });

    // Generate JWT token with 24h expiration
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Return user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      linkedinUrl: user.linkedinUrl,
      expertise: user.expertise,
      badges: user.badges,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle SQLite unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Password-less login (email only)
export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found with this email' });
    }

    // Generate JWT token with 24h expiration
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Return user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      linkedinUrl: user.linkedinUrl,
      expertise: user.expertise,
      badges: user.badges,
    };

    res.json({
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout endpoint
export const logout = async (req: Request, res: Response) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // We could implement a token blacklist here if needed
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user profile (protected route)
export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, bio, linkedinUrl, expertise, avatarUrl } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      name: name || user.name,
      bio: bio || user.bio,
      linkedinUrl: linkedinUrl || user.linkedinUrl,
      expertise: expertise || user.expertise,
      avatarUrl: avatarUrl || user.avatarUrl,
    });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
