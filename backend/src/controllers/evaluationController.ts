import { Request, Response } from 'express';
import { Evaluation } from '../models/Evaluation';
import { Submission } from '../models/Submission';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Hackathon } from '../models/Hackathon';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import { io } from '../app';

// Create evaluation
export const createEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const { hackathonId, submissionId, scores, feedback } = req.body;
    const judgeId = req.user!.id;

    // Verify submission exists and belongs to hackathon
    const submission = await Submission.findByPk(submissionId, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name'],
        },
        {
          model: Hackathon,
          as: 'hackathon',
          attributes: ['id', 'title', 'criteria'],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.hackathonId !== hackathonId) {
      return res.status(400).json({ error: 'Submission does not belong to this hackathon' });
    }

    // Check if judge already evaluated this submission
    const existingEvaluation = await Evaluation.findOne({
      where: { submissionId, judgeId },
    });

    if (existingEvaluation) {
      return res.status(400).json({ error: 'You have already evaluated this submission' });
    }

    // Create new evaluation
    const evaluation = await Evaluation.create({
      hackathonId,
      submissionId,
      judgeId,
      scores, // Will be stored as JSON string via setter
      feedback,
    });

    // Return evaluation with judge and submission details
    const evaluationWithDetails = await Evaluation.findByPk(evaluation.id, {
      include: [
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Submission,
          as: 'submission',
          attributes: ['id', 'title'],
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

    // Emit real-time events
    io.to(`hackathon-${hackathonId}`).emit('evaluation-added', {
      evaluation: evaluationWithDetails,
      timestamp: new Date().toISOString(),
    });

    // Notify team members about new evaluation
    const teamMembers = submission.team?.members || [];
    teamMembers.forEach((memberId: string) => {
      io.to(`user-${memberId}`).emit('evaluation-notification', {
        evaluation: evaluationWithDetails,
        timestamp: new Date().toISOString(),
      });
    });

    // Trigger leaderboard update
    io.to(`hackathon-${hackathonId}`).emit('leaderboard-update-needed', {
      hackathonId,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Evaluation created successfully',
      evaluation: evaluationWithDetails,
    });
  } catch (error: any) {
    console.error('Create evaluation error:', error);
    
    // Handle SQLite unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'You have already evaluated this submission' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get evaluations by submission
export const getEvaluationsBySubmission = async (req: Request, res: Response) => {
  try {
    const { id: submissionId } = req.params;

    const evaluations = await Evaluation.findAll({
      where: { submissionId },
      include: [
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ evaluations });
  } catch (error) {
    console.error('Get evaluations by submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get evaluations by judge
export const getEvaluationsByJudge = async (req: Request, res: Response) => {
  try {
    const { judgeId, hackathonId } = req.params;

    const whereClause: any = { judgeId };
    if (hackathonId) {
      whereClause.hackathonId = hackathonId;
    }

    const evaluations = await Evaluation.findAll({
      where: whereClause,
      include: [
        {
          model: Submission,
          as: 'submission',
          attributes: ['id', 'title'],
          include: [
            {
              model: Team,
              as: 'team',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ evaluations });
  } catch (error) {
    console.error('Get evaluations by judge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get leaderboard for hackathon
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;

    // Get hackathon details
    const hackathon = await Hackathon.findByPk(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Get all submissions with their evaluations
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
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    // Get all evaluations for this hackathon
    const evaluations = await Evaluation.findAll({
      where: { hackathonId },
      include: [
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'name'],
        },
      ],
    });

    // Calculate scores for each submission
    const leaderboard = submissions.map(submission => {
      const submissionEvaluations = evaluations.filter(
        evaluation => evaluation.submissionId === submission.id
      );

      if (submissionEvaluations.length === 0) {
        return {
          submission,
          team: submission.team,
          avgScore: 0,
          totalEvaluations: 0,
          rank: 0,
        };
      }

      // Calculate average score from all evaluations
      let totalScore = 0;
      submissionEvaluations.forEach(evaluation => {
        const scores = evaluation.scores; // JSON getter will parse
        if (typeof scores === 'object' && scores !== null) {
          const scoreValues = Object.values(scores);
          const avgEvalScore = scoreValues.reduce((sum: number, score: any) => sum + Number(score), 0) / scoreValues.length;
          totalScore += avgEvalScore;
        }
      });

      const avgScore = totalScore / submissionEvaluations.length;

      return {
        submission,
        team: submission.team,
        avgScore: Math.round(avgScore * 100) / 100, // Round to 2 decimal places
        totalEvaluations: submissionEvaluations.length,
        rank: 0, // Will be set after sorting
      };
    });

    // Sort by average score (descending) and assign ranks
    leaderboard.sort((a, b) => b.avgScore - a.avgScore);
    leaderboard.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json({
      leaderboard,
      hackathon: {
        id: hackathon.id,
        title: hackathon.title,
        org: hackathon.org,
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update evaluation (same judge only)
export const updateEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const judgeId = req.user!.id;
    const { scores, feedback } = req.body;

    const evaluation = await Evaluation.findByPk(id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    // Check if the judge owns this evaluation
    if (evaluation.judgeId !== judgeId) {
      return res.status(403).json({ error: 'You can only update your own evaluations' });
    }

    await evaluation.update({ scores, feedback });

    const updatedEvaluation = await Evaluation.findByPk(id, {
      include: [
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Submission,
          as: 'submission',
          attributes: ['id', 'title'],
        },
      ],
    });

    res.json({
      message: 'Evaluation updated successfully',
      evaluation: updatedEvaluation,
    });
  } catch (error) {
    console.error('Update evaluation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
