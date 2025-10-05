import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return next(new Error('User not found'));
    }

    // Attach user to socket
    socket.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Invalid authentication token'));
  }
};

export const requireRole = (roles: string[]) => {
  return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    if (!socket.user) {
      return next(new Error('Authentication required'));
    }

    if (!roles.includes(socket.user.role)) {
      return next(new Error('Insufficient permissions'));
    }

    next();
  };
};
