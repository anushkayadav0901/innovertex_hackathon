import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define the attributes interface
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'participant' | 'organizer' | 'judge' | 'mentor';
  avatarUrl?: string;
  bio?: string;
  linkedinUrl?: string;
  expertise: string[];
  badges: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes (optional fields for creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatarUrl' | 'bio' | 'linkedinUrl' | 'expertise' | 'badges' | 'createdAt' | 'updatedAt'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: 'participant' | 'organizer' | 'judge' | 'mentor';
  public avatarUrl?: string;
  public bio?: string;
  public linkedinUrl?: string;
  public expertise!: string[];
  public badges!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('participant', 'organizer', 'judge', 'mentor'),
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linkedinUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expertise: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('expertise');
        if (!value || typeof value !== 'string') return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
      set(value: string[]) {
        this.setDataValue('expertise', JSON.stringify(value || []) as any);
      },
    },
    badges: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('badges');
        if (!value || typeof value !== 'string') return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
      set(value: string[]) {
        this.setDataValue('badges', JSON.stringify(value || []) as any);
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export { User };
