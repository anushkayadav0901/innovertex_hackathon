import { Request, Response } from 'express';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Hackathon } from '../models/Hackathon';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { io } from '../app';

// Register a new team
export const registerTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, hackathonId } = req.body;
    const userId = req.user!.id;

    // Check if hackathon exists and is active
    const hackathon = await Hackathon.findByPk(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Check if hackathon is still accepting registrations
    const now = new Date();
    if (hackathon.endDate < now) {
      return res.status(400).json({ error: 'Hackathon has already ended' });
    }

    // Check if user is already in a team for this hackathon (simplified check)
    const existingTeam = await Team.findOne({
      where: {
        hackathonId,
        leaderId: userId
      }
    });

    if (existingTeam) {
      return res.status(400).json({ error: 'User is already leading a team for this hackathon' });
    }

    // Check team name uniqueness per hackathon
    const existingTeamName = await Team.findOne({
      where: { name, hackathonId }
    });

    if (existingTeamName) {
      return res.status(400).json({ error: 'Team name already exists in this hackathon' });
    }

    // Create team with user as leader
    const team = await Team.create({ 
      name, 
      hackathonId, 
      leaderId: userId,
      members: [userId.toString()] // JSON array with leader as first member
    });

    // Return team with leader info
    const teamWithDetails = await Team.findByPk(team.id, {
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org'],
        },
      ],
    });

    // Emit real-time event
    io.to(`hackathon-${hackathonId}`).emit('team-registered', {
      team: teamWithDetails,
      hackathon: { id: hackathon.id, title: hackathon.title },
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Team registered successfully',
      team: teamWithDetails,
    });
  } catch (error) {
    console.error('Register team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Join an existing team
export const joinTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id: teamId } = req.params;
    const userId = req.user!.id;

    // Check if team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is already a member (check JSON array)
    const currentMembers = team.members || [];
    if (currentMembers.includes(userId.toString())) {
      return res.status(400).json({ error: 'User is already a member of this team' });
    }

    // Check team size limit (max 6 members)
    if (currentMembers.length >= 6) {
      return res.status(400).json({ error: 'Team is full (maximum 6 members)' });
    }

    // Add user to team members array
    const updatedMembers = [...currentMembers, userId.toString()];
    await team.update({ members: updatedMembers });

    // Return updated team
    const teamWithDetails = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org'],
        },
      ],
    });

    res.json({
      message: 'Successfully joined team',
      team: teamWithDetails,
    });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Leave a team
export const leaveTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id: teamId } = req.params;
    const userId = req.user!.id;

    // Check if team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is a member
    const currentMembers = team.members || [];
    if (!currentMembers.includes(userId.toString())) {
      return res.status(404).json({ error: 'User is not a member of this team' });
    }

    // Don't allow leader to leave if there are other members
    if (team.leaderId === userId && currentMembers.length > 1) {
      return res.status(400).json({ error: 'Team leader cannot leave while there are other members' });
    }

    // Remove user from members array
    const updatedMembers = currentMembers.filter(memberId => memberId !== userId.toString());
    await team.update({ members: updatedMembers });

    res.json({ message: 'Successfully left team' });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get teams by user ID
export const getTeamsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find teams where user is leader or member
    const teams = await Team.findAll({
      where: {
        [Op.or]: [
          { leaderId: userId },
          // For SQLite, we search in the JSON string
          { members: { [Op.like]: `%"${userId}"%` } }
        ]
      },
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org', 'startDate', 'endDate'],
        },
      ],
    });

    res.json({ teams });
  } catch (error) {
    console.error('Get teams by user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get teams by hackathon ID
export const getTeamsByHackathon = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;

    const teams = await Team.findAll({
      where: { hackathonId },
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json({ teams });
  } catch (error) {
    console.error('Get teams by hackathon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update team (leader only)
export const updateTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id: teamId } = req.params;
    const { name } = req.body;
    const userId = req.user!.id;

    // Check if team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is the team leader
    if (team.leaderId !== userId) {
      return res.status(403).json({ error: 'Only team leader can update team details' });
    }

    // Update team name if provided
    if (name) {
      // Check name uniqueness in the same hackathon
      const existingTeam = await Team.findOne({
        where: { 
          name, 
          hackathonId: team.hackathonId,
          id: { [Op.ne]: teamId } // Exclude current team
        }
      });

      if (existingTeam) {
        return res.status(400).json({ error: 'Team name already exists in this hackathon' });
      }

      await team.update({ name });
    }

    // Return updated team
    const updatedTeam = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'org'],
        },
      ],
    });

    res.json({
      message: 'Team updated successfully',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
