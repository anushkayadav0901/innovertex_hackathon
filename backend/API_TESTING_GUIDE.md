# API Testing Guide - Innovertex Hackathon Platform

## Overview
This guide provides comprehensive testing instructions for the SQLite-based backend API.

## Server Setup

### 1. Start the Server
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Database connection established successfully.
✅ Database synchronized successfully.
🚀 Server running on port 3000
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173
⚡ Socket.IO enabled
```

### 2. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-05T03:30:00.000Z",
  "environment": "development"
}
```

## Authentication API Testing

### 1. User Signup (Password-less)
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "role": "participant"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@test.com",
    "role": "participant",
    "avatarUrl": null,
    "bio": null,
    "linkedinUrl": null,
    "expertise": [],
    "badges": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login (Password-less)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com"
  }'
```

### 3. Get Current User (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## Hackathon API Testing

### 1. Create Organizer User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Organizer",
    "email": "jane@organizer.com",
    "role": "organizer"
  }'
```

### 2. Create Hackathon (Organizer Only)
```bash
curl -X POST http://localhost:3000/api/hackathons \
  -H "Authorization: Bearer ORGANIZER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Innovation Challenge",
    "org": "TechCorp",
    "startDate": "2025-10-10T10:00:00Z",
    "endDate": "2025-10-12T18:00:00Z",
    "tags": ["AI", "ML", "Innovation"],
    "prize": "$10,000",
    "description": "Build innovative AI solutions",
    "criteria": [
      {"name": "Innovation", "weight": 30},
      {"name": "Technical Excellence", "weight": 25},
      {"name": "Impact", "weight": 25},
      {"name": "Presentation", "weight": 20}
    ]
  }'
```

### 3. Get All Hackathons (Public)
```bash
curl -X GET "http://localhost:3000/api/hackathons?page=1&limit=10"
```

### 4. Search Hackathons
```bash
curl -X GET "http://localhost:3000/api/hackathons?search=AI&tags=ML&status=upcoming"
```

### 5. Get Hackathon by ID
```bash
curl -X GET http://localhost:3000/api/hackathons/1
```

### 6. Update Hackathon (Organizer Only)
```bash
curl -X PUT http://localhost:3000/api/hackathons/1 \
  -H "Authorization: Bearer ORGANIZER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Innovation Challenge 2025",
    "prize": "$15,000"
  }'
```

### 7. Delete Hackathon (Organizer Only)
```bash
curl -X DELETE http://localhost:3000/api/hackathons/1 \
  -H "Authorization: Bearer ORGANIZER_TOKEN"
```

## Team Management API Testing

### 1. Register Team
```bash
curl -X POST http://localhost:3000/api/teams/register \
  -H "Authorization: Bearer PARTICIPANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Alpha",
    "hackathonId": 1
  }'
```

Expected response:
```json
{
  "message": "Team registered successfully",
  "team": {
    "id": 1,
    "name": "Team Alpha",
    "hackathonId": 1,
    "leaderId": 1,
    "members": ["1"],
    "leader": {
      "id": 1,
      "name": "John Doe",
      "email": "john@test.com",
      "avatarUrl": null
    },
    "hackathon": {
      "id": 1,
      "title": "AI Innovation Challenge",
      "org": "TechCorp"
    }
  }
}
```

### 2. Join Team
```bash
curl -X POST http://localhost:3000/api/teams/1/join \
  -H "Authorization: Bearer ANOTHER_PARTICIPANT_TOKEN"
```

### 3. Get Teams by User
```bash
curl -X GET http://localhost:3000/api/teams/user/1
```

### 4. Get Teams by Hackathon
```bash
curl -X GET http://localhost:3000/api/teams/hackathon/1
```

### 5. Update Team (Leader Only)
```bash
curl -X PUT http://localhost:3000/api/teams/1 \
  -H "Authorization: Bearer TEAM_LEADER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Alpha Pro"
  }'
```

### 6. Leave Team
```bash
curl -X DELETE http://localhost:3000/api/teams/1/leave \
  -H "Authorization: Bearer PARTICIPANT_TOKEN"
```

## Error Testing

### 1. Test Validation Errors
```bash
# Invalid email format
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "role": "participant"
  }'
```

Expected response:
```json
{
  "error": "\"email\" must be a valid email"
}
```

### 2. Test Duplicate Email
```bash
# Try to signup with existing email
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "john@test.com",
    "role": "participant"
  }'
```

Expected response:
```json
{
  "error": "Email already exists"
}
```

### 3. Test Unauthorized Access
```bash
# Try to create hackathon without token
curl -X POST http://localhost:3000/api/hackathons \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Hackathon",
    "org": "Test Org"
  }'
```

Expected response:
```json
{
  "error": "Access token required"
}
```

### 4. Test Role-Based Access
```bash
# Try to create hackathon with participant role
curl -X POST http://localhost:3000/api/hackathons \
  -H "Authorization: Bearer PARTICIPANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Hackathon",
    "org": "Test Org"
  }'
```

Expected response:
```json
{
  "error": "Insufficient permissions"
}
```

## Database Verification

### 1. Check SQLite Database
The database file `database.db` should be created in the backend directory.

### 2. View Database Contents
Use any SQLite browser tool:
- DB Browser for SQLite
- SQLite Studio
- VS Code SQLite extension

### 3. Verify Data Structure
Check that tables are created with proper schema:
- `users` table with INTEGER PRIMARY KEY
- `hackathons` table with JSON fields as TEXT
- `teams` table with members as JSON array
- Proper foreign key relationships

## Performance Testing

### 1. Load Testing
```bash
# Install apache bench
# Windows: Download from Apache website
# Mac: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test signup endpoint
ab -n 100 -c 10 -p signup.json -T application/json http://localhost:3000/api/auth/signup

# Test hackathons endpoint
ab -n 1000 -c 50 http://localhost:3000/api/hackathons
```

### 2. JSON Field Performance
Test large JSON arrays in teams and hackathons to ensure proper serialization/deserialization.

## Integration Testing

### 1. Full User Journey
1. Signup as participant
2. Login and get profile
3. View available hackathons
4. Register team for hackathon
5. Join another user to team
6. Update team details
7. Leave team

### 2. Organizer Journey
1. Signup as organizer
2. Create hackathon
3. View registered teams
4. Update hackathon details
5. Delete hackathon

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if SQLite file is created
   - Verify file permissions
   - Check disk space

2. **JSON Parse Errors**
   - Verify JSON field getters/setters
   - Check data integrity in database

3. **CORS Issues**
   - Verify frontend URL in config
   - Check CORS headers in response

4. **Token Errors**
   - Verify JWT_SECRET in environment
   - Check token expiration
   - Validate token format

### Debug Commands

```bash
# Check server logs
npm run dev

# Test database connection
node -e "const { connectDatabase } = require('./src/config/database'); connectDatabase().then(() => console.log('Connected')).catch(console.error);"

# Verify environment variables
node -e "console.log(require('./src/config/config').config);"
```

## Production Considerations

### 1. Environment Variables
Create `.env` file:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_MAX_REQUESTS=1000
```

### 2. Security
- Use strong JWT secrets
- Enable HTTPS in production
- Implement proper rate limiting
- Add request logging
- Validate all inputs

### 3. Performance
- Add database indexes for frequently queried fields
- Implement caching for read-heavy operations
- Consider connection pooling
- Monitor memory usage with large JSON fields

### 4. Monitoring
- Add health check endpoints
- Implement logging middleware
- Monitor database file size
- Track API response times
