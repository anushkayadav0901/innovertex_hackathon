import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface EvaluationAttributes {
  id: number;
  hackathonId: number;
  submissionId: number;
  judgeId: number;
  scores: Array<{ criterionId: string; score: number }>;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EvaluationCreationAttributes extends Optional<EvaluationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Evaluation extends Model<EvaluationAttributes, EvaluationCreationAttributes> implements EvaluationAttributes {
  public id!: number;
  public hackathonId!: number;
  public submissionId!: number;
  public judgeId!: number;
  public scores!: Array<{ criterionId: string; score: number }>;
  public feedback?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Evaluation.init(
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
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'submissions',
        key: 'id',
      },
    },
    judgeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    scores: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('scores');
        if (!value || typeof value !== 'string') return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
      set(value: Array<{ criterionId: string; score: number }>) {
        this.setDataValue('scores', JSON.stringify(value || []) as any);
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Evaluation',
    tableName: 'evaluations',
    indexes: [
      {
        unique: true,
        fields: ['submission_id', 'judge_id'],
        name: 'unique_judge_submission_evaluation'
      }
    ],
  }
);

export { Evaluation };
