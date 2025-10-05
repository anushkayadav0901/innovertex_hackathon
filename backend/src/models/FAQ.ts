import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface FAQAttributes {
  id: number;
  hackathonId: number;
  question: string;
  answer: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FAQCreationAttributes extends Optional<FAQAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class FAQ extends Model<FAQAttributes, FAQCreationAttributes> implements FAQAttributes {
  public id!: number;
  public hackathonId!: number;
  public question!: string;
  public answer!: string;
  public createdBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FAQ.init(
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
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'FAQ',
    tableName: 'faqs',
    indexes: [
      {
        fields: ['hackathon_id'],
        name: 'idx_faqs_hackathon'
      }
    ],
  }
);

export { FAQ };
