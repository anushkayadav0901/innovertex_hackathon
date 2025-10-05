import { User } from './User';
import { Hackathon } from './Hackathon';
import { Team } from './Team';
import { Submission } from './Submission';
import { Evaluation } from './Evaluation';
import { Message } from './Message';
import { Announcement } from './Announcement';
import { FAQ } from './FAQ';
import { Question } from './Question';

// Define associations
User.hasMany(Hackathon, { foreignKey: 'organizerId', as: 'organizedHackathons' });
Hackathon.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

Hackathon.hasMany(Team, { foreignKey: 'hackathonId', as: 'teams' });
Team.belongsTo(Hackathon, { foreignKey: 'hackathonId', as: 'hackathon' });

User.hasMany(Team, { foreignKey: 'leaderId', as: 'ledTeams' });
Team.belongsTo(User, { foreignKey: 'leaderId', as: 'leader' });

Team.hasMany(Submission, { foreignKey: 'teamId', as: 'submissions' });
Submission.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

Hackathon.hasMany(Submission, { foreignKey: 'hackathonId', as: 'submissions' });
Submission.belongsTo(Hackathon, { foreignKey: 'hackathonId', as: 'hackathon' });

// Evaluation associations
User.hasMany(Evaluation, { foreignKey: 'judgeId', as: 'evaluations' });
Evaluation.belongsTo(User, { foreignKey: 'judgeId', as: 'judge' });

Submission.hasMany(Evaluation, { foreignKey: 'submissionId', as: 'evaluations' });
Evaluation.belongsTo(Submission, { foreignKey: 'submissionId', as: 'submission' });

// Communication model associations
Hackathon.hasMany(Message, { foreignKey: 'hackathonId', as: 'messages' });
Message.belongsTo(Hackathon, { foreignKey: 'hackathonId', as: 'hackathon' });

User.hasMany(Message, { foreignKey: 'userId', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hackathon.hasMany(Announcement, { foreignKey: 'hackathonId', as: 'announcements' });
Announcement.belongsTo(Hackathon, { foreignKey: 'hackathonId', as: 'hackathon' });

User.hasMany(Announcement, { foreignKey: 'organizerId', as: 'announcements' });
Announcement.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

Hackathon.hasMany(FAQ, { foreignKey: 'hackathonId', as: 'faqs' });
FAQ.belongsTo(Hackathon, { foreignKey: 'hackathonId', as: 'hackathon' });

User.hasMany(FAQ, { foreignKey: 'createdBy', as: 'createdFAQs' });
FAQ.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Hackathon.hasMany(Question, { foreignKey: 'hackathonId', as: 'questions' });
Question.belongsTo(Hackathon, { foreignKey: 'hackathonId', as: 'hackathon' });

User.hasMany(Question, { foreignKey: 'userId', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Question, { foreignKey: 'answeredBy', as: 'answeredQuestions' });
Question.belongsTo(User, { foreignKey: 'answeredBy', as: 'answerer' });

export { User, Hackathon, Team, Submission, Evaluation, Message, Announcement, FAQ, Question };
