import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define the attributes interface
interface HackathonAttributes {
  id: number;
  title: string;
  org: string;
  organizerId: number;
  startDate: Date;
  endDate: Date;
  description?: string;
  tags: string[];
  prize?: string;
  criteria?: any;
  dateRange?: string;
  startAt?: number;
  endAt?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes (optional fields for creation)
interface HackathonCreationAttributes extends Optional<HackathonAttributes, 'id' | 'description' | 'tags' | 'prize' | 'criteria' | 'dateRange' | 'startAt' | 'endAt' | 'createdAt' | 'updatedAt'> {}

// Define the Hackathon model class
class Hackathon extends Model<HackathonAttributes, HackathonCreationAttributes> implements HackathonAttributes {
  public id!: number;
  public title!: string;
  public org!: string;
  public organizerId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public description?: string;
  public tags!: string[];
  public prize?: string;
  public criteria?: any;
  public dateRange?: string;
  public startAt?: number;
  public endAt?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Hackathon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    org: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('tags');
        if (!value || typeof value !== 'string') return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
      set(value: string[]) {
        this.setDataValue('tags', JSON.stringify(value || []) as any);
      },
    },
    prize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateRange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    endAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    criteria: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('criteria');
        if (!value || typeof value !== 'string') return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
      set(value: any) {
        this.setDataValue('criteria', JSON.stringify(value || []) as any);
      },
    },
  },
  {
    sequelize,
    modelName: 'Hackathon',
    tableName: 'hackathons',
  }
);

export { Hackathon };
