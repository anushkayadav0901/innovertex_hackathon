import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Announcement } from '../models/Announcement';
import { FAQ } from '../models/FAQ';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { Hackathon } from '../models/Hackathon';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { io } from '../app';

// Create announcement (organizer only)
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { hackathonId, title, content, priority = 'normal' } = req.body;
    const organizerId = req.user!.id;

    // Verify hackathon exists and user is organizer
    const hackathon = await Hackathon.findByPk(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    if (hackathon.organizerId !== organizerId) {
      return res.status(403).json({ error: 'Only hackathon organizer can create announcements' });
    }

    // Create announcement
    const announcement = await Announcement.create({
      hackathonId,
      organizerId,
      title,
      content,
      priority,
    });

    // Get announcement with organizer details
    const announcementWithDetails = await Announcement.findByPk(announcement.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Emit real-time notification to hackathon room
    io.to(`hackathon-${hackathonId}`).emit('new-announcement', {
      announcement: announcementWithDetails,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: announcementWithDetails,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get announcements by hackathon
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;

    const announcements = await Announcement.findAll({
      where: { hackathonId },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create FAQ (organizer only)
export const createFAQ = async (req: AuthRequest, res: Response) => {
  try {
    const { hackathonId, question, answer } = req.body;
    const createdBy = req.user!.id;

    // Verify hackathon exists and user is organizer
    const hackathon = await Hackathon.findByPk(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    if (hackathon.organizerId !== createdBy) {
      return res.status(403).json({ error: 'Only hackathon organizer can create FAQs' });
    }

    // Create FAQ
    const faq = await FAQ.create({
      hackathonId,
      question,
      answer,
      createdBy,
    });

    // Get FAQ with creator details
    const faqWithDetails = await FAQ.findByPk(faq.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Emit real-time notification to hackathon room
    io.to(`hackathon-${hackathonId}`).emit('new-faq', {
      faq: faqWithDetails,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'FAQ created successfully',
      faq: faqWithDetails,
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get FAQs by hackathon
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;

    const faqs = await FAQ.findAll({
      where: { hackathonId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ faqs });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create question (any authenticated user)
export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { hackathonId, question } = req.body;
    const userId = req.user!.id;

    // Verify hackathon exists
    const hackathon = await Hackathon.findByPk(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Create question
    const newQuestion = await Question.create({
      hackathonId,
      userId,
      question,
    });

    // Get question with user details
    const questionWithDetails = await Question.findByPk(newQuestion.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Emit real-time notification to organizer
    io.to(`organizer-${hackathon.organizerId}`).emit('new-question', {
      question: questionWithDetails,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Question submitted successfully',
      question: questionWithDetails,
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Answer question (organizer only)
export const answerQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const answeredBy = req.user!.id;

    // Get question with hackathon details
    const question = await Question.findByPk(id, {
      include: [
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'organizerId'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Verify user is organizer
    if (question.hackathon?.organizerId !== answeredBy) {
      return res.status(403).json({ error: 'Only hackathon organizer can answer questions' });
    }

    // Update question with answer
    await question.update({
      answer,
      answeredBy,
      status: 'answered',
      answeredAt: new Date(),
    });

    // Get updated question with answerer details
    const updatedQuestion = await Question.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'answerer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Emit real-time notification to question asker
    io.to(`user-${question.userId}`).emit('question-answered', {
      question: updatedQuestion,
      timestamp: new Date().toISOString(),
    });

    res.json({
      message: 'Question answered successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get questions by hackathon
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;
    const { status } = req.query;

    const whereClause: any = { hackathonId };
    if (status) {
      whereClause.status = status;
    }

    const questions = await Question.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'answerer',
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
      order: [['status', 'ASC'], ['createdAt', 'DESC']],
    });

    res.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get messages by hackathon and room type
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;
    const { roomType = 'general', page = 1, limit = 50 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const messages = await Message.findAll({
      where: { 
        hackathonId,
        roomType: roomType as string,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({ 
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: messages.length,
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Store message (called from socket handler)
export const storeMessage = async (hackathonId: number, userId: number, roomType: string, message: string) => {
  try {
    const newMessage = await Message.create({
      hackathonId,
      userId,
      roomType: roomType as any,
      message,
    });

    // Get message with user details
    const messageWithUser = await Message.findByPk(newMessage.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
    });

    return messageWithUser;
  } catch (error) {
    console.error('Store message error:', error);
    throw error;
  }
};
