import { Request, Response } from 'express';
import { Submission } from '../models/Submission';
import { Team } from '../models/Team';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { io } from '../app';

// Create submission
export const createSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { hackathonId, teamId, title, repoUrl, figmaUrl, driveUrl, deckUrl, description } = req.body;
    const userId = req.user!.id;

    // Check if hackathon exists and is active
    const hackathon = await Hackathon.findByPk(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Check submission deadline
    const now = new Date();
    if (hackathon.endDate < now) {
      return res.status(400).json({ error: 'Submission deadline has passed' });
    }

    // Check if team exists and user is a member
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Verify team belongs to hackathon
    if (team.hackathonId !== hackathonId) {
      return res.status(400).json({ error: 'Team does not belong to this hackathon' });
    }

    // Check if user is team member (check JSON array)
    const members = team.members || [];
    if (!members.includes(userId.toString())) {
      return res.status(403).json({ error: 'Only team members can create submissions' });
    }

    // Check if submission already exists for this team
    const existingSubmission = await Submission.findOne({
      where: { hackathonId, teamId },
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'Team has already submitted for this hackathon' });
    }

    // Create new submission
    const submission = await Submission.create({
      hackathonId,
      teamId,
      title,
      repoUrl,
      figmaUrl,
      driveUrl,
      deckUrl,
      description,
    });

    // Return submission with team and hackathon details
    const submissionWithDetails = await Submission.findByPk(submission.id, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name'],
          include: [
            {
              model: User,
              as: 'leader',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org'],
        },
      ],
    });

    // Emit real-time event to hackathon room
    io.to(`hackathon-${hackathonId}`).emit('submission-created', {
      submission: submissionWithDetails,
      timestamp: new Date().toISOString(),
    });

    // Notify judges about new submission
    io.to(`judges-${hackathonId}`).emit('new-submission-notification', {
      submission: submissionWithDetails,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Submission created successfully',
      submission: submissionWithDetails,
    });
  } catch (error: any) {
    console.error('Create submission error:', error);
    
    // Handle SQLite unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Team has already submitted for this hackathon' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get submissions by hackathon
export const getSubmissionsByHackathon = async (req: Request, res: Response) => {
  try {
    const { id: hackathonId } = req.params;

    const submissions = await Submission.findAll({
      where: { hackathonId },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'members'],
          include: [
            {
              model: User,
              as: 'leader',
              attributes: ['id', 'name', 'email', 'avatarUrl'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions by hackathon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get submissions by team
export const getSubmissionsByTeam = async (req: Request, res: Response) => {
  try {
    const { id: teamId } = req.params;

    const submissions = await Submission.findAll({
      where: { teamId },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org', 'startDate', 'endDate'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions by team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update submission (team members only)
export const updateSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const submission = await Submission.findByPk(id, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'members'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'endDate'],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check submission deadline
    const now = new Date();
    if (submission.hackathon && submission.hackathon.endDate < now) {
      return res.status(400).json({ error: 'Submission deadline has passed' });
    }

    // Check if user is team member (check JSON array)
    const members = submission.team?.members || [];
    if (!members.includes(userId.toString())) {
      return res.status(403).json({ error: 'Only team members can update this submission' });
    }

    await submission.update(req.body);

    const updatedSubmission = await Submission.findByPk(id, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org'],
        },
      ],
    });

    res.json({
      message: 'Submission updated successfully',
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete submission (team leader only)
export const deleteSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const submission = await Submission.findByPk(id, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'leaderId'],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user is team leader
    if (submission.team?.leaderId !== userId) {
      return res.status(403).json({ error: 'Only team leader can delete this submission' });
    }

    await submission.destroy();

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
