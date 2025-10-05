import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AnnouncementAttributes {
  id: number;
  hackathonId: number;
  organizerId: number;
  title: string;
  content: string;
  priority: 'high' | 'normal' | 'low';
  createdAt?: Date;
  updatedAt?: Date;
}

interface AnnouncementCreationAttributes extends Optional<AnnouncementAttributes, 'id' | 'priority' | 'createdAt' | 'updatedAt'> {}

class Announcement extends Model<AnnouncementAttributes, AnnouncementCreationAttributes> implements AnnouncementAttributes {
  public id!: number;
  public hackathonId!: number;
  public organizerId!: number;
  public title!: string;
  public content!: string;
  public priority!: 'high' | 'normal' | 'low';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Announcement.init(
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
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'organizer_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'normal',
      validate: {
        isIn: [['high', 'normal', 'low']],
      },
    },
  },
  {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcements',
    indexes: [
      {
        fields: ['hackathon_id', 'created_at'],
        name: 'idx_announcements_hackathon_time'
      },
      {
        fields: ['priority'],
        name: 'idx_announcements_priority'
      }
    ],
  }
);

export { Announcement };
