import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Get database path from environment or use default
const databasePath = process.env.DATABASE_PATH || './database/hackathon.db';
const databaseDir = path.dirname(databasePath);

// Ensure database directory exists
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
  console.log(`Created database directory: ${databaseDir}`);
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database tables
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized successfully.');
    } else {
      await sequelize.sync({ force: false });
      console.log('✅ Database tables verified.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { sequelize };
