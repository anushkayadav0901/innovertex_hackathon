import { Server } from 'socket.io';
import { AuthenticatedSocket } from './socketAuth';
import { storeMessage } from '../controllers/communicationController';
import { Hackathon } from '../models/Hackathon';
import { Team } from '../models/Team';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.id} (${socket.user?.name})`);

    // Join hackathon room
    socket.on('join-hackathon-room', async ({ hackathonId }) => {
      try {
        // Verify hackathon exists
        const hackathon = await Hackathon.findByPk(hackathonId);
        if (!hackathon) {
          socket.emit('error', { message: 'Hackathon not found' });
          return;
        }

        socket.join(`hackathon-${hackathonId}`);
        console.log(`User ${socket.user?.name} joined hackathon room ${hackathonId}`);
        
        socket.emit('joined-hackathon-room', { hackathonId });
      } catch (error) {
        console.error('Join hackathon room error:', error);
        socket.emit('error', { message: 'Failed to join hackathon room' });
      }
    });

    // Leave hackathon room
    socket.on('leave-hackathon-room', ({ hackathonId }) => {
      socket.leave(`hackathon-${hackathonId}`);
      console.log(`User ${socket.user?.name} left hackathon room ${hackathonId}`);
      socket.emit('left-hackathon-room', { hackathonId });
    });

    // Join judge room (judges only)
    socket.on('join-judge-room', async ({ hackathonId }) => {
      try {
        if (socket.user?.role !== 'judge') {
          socket.emit('error', { message: 'Only judges can join judge rooms' });
          return;
        }

        // Verify hackathon exists
        const hackathon = await Hackathon.findByPk(hackathonId);
        if (!hackathon) {
          socket.emit('error', { message: 'Hackathon not found' });
          return;
        }

        socket.join(`judges-${hackathonId}`);
        console.log(`Judge ${socket.user?.name} joined judge room ${hackathonId}`);
        
        socket.emit('joined-judge-room', { hackathonId });
      } catch (error) {
        console.error('Join judge room error:', error);
        socket.emit('error', { message: 'Failed to join judge room' });
      }
    });

    // Join user room for personal notifications
    socket.on('join-user-room', () => {
      if (socket.user) {
        socket.join(`user-${socket.user.id}`);
        console.log(`User ${socket.user.name} joined personal room`);
        socket.emit('joined-user-room', { userId: socket.user.id });
      }
    });

    // Join organizer room (organizers only)
    socket.on('join-organizer-room', () => {
      if (socket.user?.role === 'organizer') {
        socket.join(`organizer-${socket.user.id}`);
        console.log(`Organizer ${socket.user.name} joined organizer room`);
        socket.emit('joined-organizer-room', { organizerId: socket.user.id });
      } else {
        socket.emit('error', { message: 'Only organizers can join organizer rooms' });
      }
    });

    // Handle judge messages
    socket.on('judge-message', async ({ hackathonId, message, roomType = 'judge' }) => {
      try {
        if (socket.user?.role !== 'judge') {
          socket.emit('error', { message: 'Only judges can send judge messages' });
          return;
        }

        if (!socket.user || !hackathonId || !message) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Store message in database
        const storedMessage = await storeMessage(
          hackathonId,
          socket.user.id,
          roomType,
          message
        );

        // Broadcast to judge room
        io.to(`judges-${hackathonId}`).emit('new-judge-message', {
          message: storedMessage,
          timestamp: new Date().toISOString(),
        });

      } catch (error) {
        console.error('Judge message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle general messages
    socket.on('general-message', async ({ hackathonId, message, roomType = 'general' }) => {
      try {
        if (!socket.user || !hackathonId || !message) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Store message in database
        const storedMessage = await storeMessage(
          hackathonId,
          socket.user.id,
          roomType,
          message
        );

        // Broadcast to hackathon room
        io.to(`hackathon-${hackathonId}`).emit('new-general-message', {
          message: storedMessage,
          timestamp: new Date().toISOString(),
        });

      } catch (error) {
        console.error('General message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle team progress updates
    socket.on('team-progress-update', async ({ hackathonId, teamId, stage, progress }) => {
      try {
        if (!socket.user || !hackathonId || !teamId) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Verify team exists and user is member
        const team = await Team.findByPk(teamId);
        if (!team) {
          socket.emit('error', { message: 'Team not found' });
          return;
        }

        const members = team.members || [];
        if (!members.includes(socket.user.id.toString())) {
          socket.emit('error', { message: 'Only team members can update progress' });
          return;
        }

        // Broadcast progress update
        io.to(`hackathon-${hackathonId}`).emit('team-progress-updated', {
          teamId,
          stage,
          progress,
          updatedBy: socket.user.name,
          timestamp: new Date().toISOString(),
        });

      } catch (error) {
        console.error('Team progress update error:', error);
        socket.emit('error', { message: 'Failed to update team progress' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', ({ hackathonId, roomType = 'general' }) => {
      if (socket.user) {
        const room = roomType === 'judge' ? `judges-${hackathonId}` : `hackathon-${hackathonId}`;
        socket.to(room).emit('user-typing', {
          userId: socket.user.id,
          userName: socket.user.name,
          roomType,
        });
      }
    });

    socket.on('typing-stop', ({ hackathonId, roomType = 'general' }) => {
      if (socket.user) {
        const room = roomType === 'judge' ? `judges-${hackathonId}` : `hackathon-${hackathonId}`;
        socket.to(room).emit('user-stopped-typing', {
          userId: socket.user.id,
          roomType,
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id} (${socket.user?.name})`);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

// Helper function to emit real-time events from API endpoints
export const emitToHackathonRoom = (io: Server, hackathonId: number, event: string, data: any) => {
  io.to(`hackathon-${hackathonId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export const emitToUserRoom = (io: Server, userId: number, event: string, data: any) => {
  io.to(`user-${userId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export const emitToJudgeRoom = (io: Server, hackathonId: number, event: string, data: any) => {
  io.to(`judges-${hackathonId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};
