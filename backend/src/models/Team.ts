import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TeamAttributes {
  id: number;
  name: string;
  hackathonId: number;
  leaderId?: number;
  members: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, 'id' | 'leaderId' | 'members' | 'createdAt' | 'updatedAt'> {}

class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: number;
  public name!: string;
  public hackathonId!: number;
  public leaderId?: number;
  public members!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hackathonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hackathons',
        key: 'id',
      },
    },
    leaderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    members: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('members');
        if (!value || typeof value !== 'string') return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
      set(value: string[]) {
        this.setDataValue('members', JSON.stringify(value || []) as any);
      },
    },
  },
  {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
  }
);

export { Team };
