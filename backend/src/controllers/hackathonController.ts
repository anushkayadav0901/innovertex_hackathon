import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Submission } from '../models/Submission';
import { AuthRequest } from '../middleware/auth';

export const createHackathon = async (req: AuthRequest, res: Response) => {
  try {
    const organizerId = req.user!.id;
    const hackathonData = {
      ...req.body,
      organizerId,
    };

    const hackathon = await Hackathon.create(hackathonData);

    res.status(201).json({
      message: 'Hackathon created successfully',
      hackathon,
    });
  } catch (error) {
    console.error('Create hackathon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllHackathons = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      tags, 
      status 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // Search by title or org (SQLite LIKE operator)
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { org: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by tags (JSON search in SQLite)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      // For SQLite, we'll search within the JSON string
      const tagConditions = tagArray.map(tag => ({
        tags: { [Op.like]: `%"${tag}"%` }
      }));
      whereClause[Op.or] = whereClause[Op.or] ? 
        [...whereClause[Op.or], ...tagConditions] : tagConditions;
    }

    // Filter by status using date comparison
    if (status) {
      const now = new Date();
      switch (status) {
        case 'active':
          whereClause.startDate = { [Op.lte]: now };
          whereClause.endDate = { [Op.gte]: now };
          break;
        case 'upcoming':
          whereClause.startDate = { [Op.gt]: now };
          break;
        case 'past':
          whereClause.endDate = { [Op.lt]: now };
          break;
      }
    }

    const { count, rows: hackathons } = await Hackathon.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      hackathons,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (error) {
    console.error('Get hackathons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHackathonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findByPk(id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Team,
          as: 'teams',
          include: [
            {
              model: User,
              as: 'leader',
              attributes: ['id', 'name', 'email', 'avatarUrl'],
            },
          ],
        },
        {
          model: Submission,
          as: 'submissions',
          include: [
            {
              model: Team,
              as: 'team',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    res.json({ hackathon });
  } catch (error) {
    console.error('Get hackathon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHackathon = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const hackathon = await Hackathon.findByPk(id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Check if user is the organizer
    if (hackathon.organizerId !== userId) {
      return res.status(403).json({ error: 'Only the organizer can update this hackathon' });
    }

    await hackathon.update(req.body);

    res.json({
      message: 'Hackathon updated successfully',
      hackathon,
    });
  } catch (error) {
    console.error('Update hackathon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHackathon = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const hackathon = await Hackathon.findByPk(id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Check if user is the organizer
    if (hackathon.organizerId !== userId) {
      return res.status(403).json({ error: 'Only the organizer can delete this hackathon' });
    }

    await hackathon.destroy();

    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    console.error('Delete hackathon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
