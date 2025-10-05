import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config/config';
import { connectDatabase } from './config/database';
import { seedDatabase } from './seeders';

// Import routes
import authRoutes from './routes/auth';
import hackathonRoutes from './routes/hackathons';
import teamRoutes from './routes/teams';
import submissionRoutes from './routes/submissions';
import evaluationRoutes from './routes/evaluations';
import communicationRoutes from './routes/communications';

// Import socket handlers
import { authenticateSocket } from './socket/socketAuth';
import { setupSocketHandlers } from './socket/socketHandlers';

const app = express();
const server = createServer(app);

// Initialize Socket.IO with authentication
const io = new SocketIOServer(server, {
  cors: {
    origin: config.socket.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use(authenticateSocket);

// Setup socket event handlers
setupSocketHandlers(io);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(compression());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/communications', communicationRoutes);

// Real-time features are handled by setupSocketHandlers

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Resource already exists' });
  }
  
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'Invalid reference to related resource' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    ...(config.nodeEnv === 'development' && { details: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Seed database in development
    if (config.nodeEnv === 'development') {
      await seedDatabase();
    }
    
    // Start server
    server.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS enabled for: ${config.cors.origin}`);
      console.log(`⚡ Socket.IO enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, io };
