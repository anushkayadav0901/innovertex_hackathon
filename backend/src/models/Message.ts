import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MessageAttributes {
  id: number;
  hackathonId: number;
  userId: number;
  roomType: 'judge' | 'general' | 'team' | 'organizer';
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public hackathonId!: number;
  public userId!: number;
  public roomType!: 'judge' | 'general' | 'team' | 'organizer';
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
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
    roomType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'room_type',
      validate: {
        isIn: [['judge', 'general', 'team', 'organizer']],
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    indexes: [
      {
        fields: ['hackathon_id', 'room_type', 'created_at'],
        name: 'idx_messages_hackathon_room_time'
      },
      {
        fields: ['user_id'],
        name: 'idx_messages_user'
      }
    ],
  }
);

export { Message };
