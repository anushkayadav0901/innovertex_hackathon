# SQLite Database Setup Guide

## Overview
This guide covers the complete SQLite database setup for the Innovertex Hackathon Platform backend.

## Database Configuration

### Connection Settings
- **Dialect**: SQLite
- **Storage**: `./database.db` (file-based database)
- **Logging**: Enabled in development mode
- **Pool**: Connection pooling configured for optimal performance

### Features Enabled
- Foreign key constraints
- WAL (Write-Ahead Logging) mode for better concurrency
- Automatic timestamps (created_at, updated_at)

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('participant', 'organizer', 'judge', 'mentor')),
    avatar_url TEXT,
    badges TEXT, -- JSON string for SQLite
    bio TEXT,
    expertise TEXT, -- JSON string for SQLite
    linkedin_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Hackathons Table
```sql
CREATE TABLE hackathons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    org VARCHAR(255) NOT NULL,
    organizer_id INTEGER REFERENCES users(id),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    tags TEXT, -- JSON string for SQLite
    prize VARCHAR(255),
    description TEXT,
    criteria TEXT, -- JSON string for SQLite
    date_range VARCHAR(255),
    start_at BIGINT, -- Unix timestamp
    end_at BIGINT, -- Unix timestamp
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Teams Table
```sql
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    hackathon_id INTEGER REFERENCES hackathons(id),
    leader_id INTEGER REFERENCES users(id),
    members TEXT, -- JSON array as string for SQLite
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Submissions Table
```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hackathon_id INTEGER REFERENCES hackathons(id),
    team_id INTEGER REFERENCES teams(id),
    title VARCHAR(255) NOT NULL,
    repo_url VARCHAR(255),
    figma_url VARCHAR(255),
    drive_url VARCHAR(255),
    deck_url VARCHAR(255),
    description TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Evaluations Table
```sql
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hackathon_id INTEGER REFERENCES hackathons(id),
    submission_id INTEGER REFERENCES submissions(id),
    judge_id INTEGER REFERENCES users(id),
    scores TEXT, -- JSON string for SQLite
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Sequelize Models

### JSON Field Handling
SQLite doesn't support native JSON types, so we use TEXT fields with JSON serialization:

```typescript
// Example: Tags field in Hackathon model
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
```

### Model Associations
- **User** → hasMany → **Hackathon** (as organizer)
- **Hackathon** → hasMany → **Team**
- **User** → hasMany → **Team** (as leader)
- **Team** → hasMany → **Submission**
- **Submission** → hasMany → **Evaluation**
- **User** → hasMany → **Evaluation** (as judge)

## Performance Optimizations

### Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_hackathons_organizer ON hackathons(organizer_id);
CREATE INDEX idx_hackathons_dates ON hackathons(start_date, end_date);
CREATE INDEX idx_teams_hackathon ON teams(hackathon_id);
CREATE INDEX idx_teams_leader ON teams(leader_id);
CREATE INDEX idx_submissions_hackathon ON submissions(hackathon_id);
CREATE INDEX idx_submissions_team ON submissions(team_id);
CREATE INDEX idx_evaluations_submission ON evaluations(submission_id);
CREATE INDEX idx_evaluations_judge ON evaluations(judge_id);
```

### SQLite Configuration
```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
```

## Development Workflow

### Starting the Server
```bash
cd backend
npm install
npm run dev
```

### Database Operations
- **Auto-sync**: Database schema automatically syncs in development
- **File location**: `./database.db` in the backend directory
- **Backup**: Simply copy the `database.db` file

### Viewing Database
Use any SQLite browser tool:
- DB Browser for SQLite (recommended)
- SQLite Studio
- VS Code SQLite extension

## API Endpoints

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Hackathons
- `GET /api/hackathons` - List all hackathons
- `POST /api/hackathons` - Create hackathon
- `GET /api/hackathons/:id` - Get hackathon by ID
- `PUT /api/hackathons/:id` - Update hackathon
- `DELETE /api/hackathons/:id` - Delete hackathon

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Submissions
- `GET /api/submissions` - List all submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions/:id` - Get submission by ID
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Evaluations
- `GET /api/evaluations` - List all evaluations
- `POST /api/evaluations` - Create evaluation
- `GET /api/evaluations/:id` - Get evaluation by ID
- `PUT /api/evaluations/:id` - Update evaluation
- `DELETE /api/evaluations/:id` - Delete evaluation

## Migration from PostgreSQL

### Key Changes Made
1. **ID Fields**: Changed from UUID to INTEGER PRIMARY KEY AUTOINCREMENT
2. **Array Fields**: Converted to TEXT with JSON serialization
3. **JSONB Fields**: Converted to TEXT with JSON serialization
4. **Timestamps**: Changed from TIMESTAMP to DATETIME
5. **Foreign Keys**: Updated to use INTEGER references

### Data Migration
If migrating existing data:
1. Export data from PostgreSQL as JSON
2. Transform UUID fields to integers
3. Convert array/JSON fields to JSON strings
4. Import into SQLite using custom migration script

## Troubleshooting

### Common Issues
1. **Foreign Key Errors**: Ensure `PRAGMA foreign_keys = ON;`
2. **JSON Parse Errors**: Check getter/setter implementations
3. **Connection Issues**: Verify file permissions for database.db
4. **Performance**: Use indexes for frequently queried fields

### Debugging
- Enable SQL logging in development
- Use SQLite browser to inspect data
- Check server logs for Sequelize errors

## Production Considerations

### Backup Strategy
- Regular file-based backups of database.db
- Consider using SQLite's backup API
- Store backups in secure, versioned storage

### Performance
- SQLite handles moderate loads well
- Consider PostgreSQL for high-concurrency production
- Monitor database size and query performance

### Security
- File-based database requires proper file permissions
- Consider encryption for sensitive data
- Regular security updates for SQLite library
