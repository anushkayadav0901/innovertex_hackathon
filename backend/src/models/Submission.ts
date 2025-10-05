import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SubmissionAttributes {
  id: number;
  hackathonId: number;
  teamId: number;
  title: string;
  description?: string;
  repoUrl?: string;
  figmaUrl?: string;
  driveUrl?: string;
  deckUrl?: string;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubmissionCreationAttributes extends Optional<SubmissionAttributes, 'id' | 'submittedAt' | 'createdAt' | 'updatedAt'> {}

class Submission extends Model<SubmissionAttributes, SubmissionCreationAttributes> implements SubmissionAttributes {
  public id!: number;
  public hackathonId!: number;
  public teamId!: number;
  public title!: string;
  public description?: string;
  public repoUrl?: string;
  public figmaUrl?: string;
  public driveUrl?: string;
  public deckUrl?: string;
  public submittedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hackathonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hackathons',
        key: 'id',
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    repoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    figmaUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    driveUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deckUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Submission',
    tableName: 'submissions',
    indexes: [
      {
        unique: true,
        fields: ['hackathon_id', 'team_id'],
        name: 'unique_team_hackathon_submission'
      }
    ],
  }
);

export { Submission };
