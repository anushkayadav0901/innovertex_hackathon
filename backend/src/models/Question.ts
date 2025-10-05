import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface QuestionAttributes {
  id: number;
  hackathonId: number;
  userId: number;
  question: string;
  answer?: string;
  answeredBy?: number;
  status: 'pending' | 'answered';
  createdAt?: Date;
  answeredAt?: Date;
  updatedAt?: Date;
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id' | 'answer' | 'answeredBy' | 'status' | 'createdAt' | 'answeredAt' | 'updatedAt'> {}

class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public hackathonId!: number;
  public userId!: number;
  public question!: string;
  public answer?: string;
  public answeredBy?: number;
  public status!: 'pending' | 'answered';
  public readonly createdAt!: Date;
  public answeredAt?: Date;
  public readonly updatedAt!: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hackathonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'hackathon_id',
      references: {
        model: 'hackathons',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answeredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'answered_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'answered']],
      },
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'answered_at',
    },
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
    indexes: [
      {
        fields: ['hackathon_id', 'status'],
        name: 'idx_questions_hackathon_status'
      },
      {
        fields: ['user_id'],
        name: 'idx_questions_user'
      }
    ],
  }
);

export { Question };
