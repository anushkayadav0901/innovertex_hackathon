-- Innovertex Hackathon Platform SQLite Database Schema

-- Users table
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

-- Hackathons table
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

-- Teams table
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    hackathon_id INTEGER REFERENCES hackathons(id),
    leader_id INTEGER REFERENCES users(id),
    members TEXT, -- JSON array as string for SQLite
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
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

-- Evaluations table
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

-- Create indexes for better performance
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

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;
