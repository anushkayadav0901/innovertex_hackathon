# Phase 3 Testing Guide: Submissions & Evaluations

## Overview
This guide covers testing the submission and evaluation system with SQLite optimizations.

## Prerequisites
1. Server running: `npm run dev`
2. Test users created (participant, organizer, judge)
3. Test hackathon created
4. Test team registered

## Submission System Testing

### 1. Create Test Data

#### Create Judge User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Judge Smith",
    "email": "judge@test.com",
    "role": "judge"
  }'
```

#### Login as Judge
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "judge@test.com"
  }'
```
*Save the token as JUDGE_TOKEN*

### 2. Submission API Testing

#### Create Submission (Team Member)
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer TEAM_MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "teamId": 1,
    "title": "AI Climate Tracker",
    "repoUrl": "https://github.com/team/climate-tracker",
    "figmaUrl": "https://figma.com/project123",
    "driveUrl": "https://drive.google.com/folder/abc123",
    "deckUrl": "https://docs.google.com/presentation/d/xyz789",
    "description": "ML model for climate data analysis using satellite imagery"
  }'
```

Expected response:
```json
{
  "message": "Submission created successfully",
  "submission": {
    "id": 1,
    "hackathonId": 1,
    "teamId": 1,
    "title": "AI Climate Tracker",
    "repoUrl": "https://github.com/team/climate-tracker",
    "figmaUrl": "https://figma.com/project123",
    "driveUrl": "https://drive.google.com/folder/abc123",
    "deckUrl": "https://docs.google.com/presentation/d/xyz789",
    "description": "ML model for climate data analysis using satellite imagery",
    "team": {
      "id": 1,
      "name": "Team Alpha",
      "leader": {
        "id": 1,
        "name": "John Doe",
        "email": "john@test.com"
      }
    },
    "hackathon": {
      "id": 1,
      "title": "AI Innovation Challenge",
      "org": "TechCorp"
    }
  }
}
```

#### Get Submissions by Hackathon
```bash
curl -X GET http://localhost:3000/api/submissions/hackathon/1
```

#### Get Submissions by Team
```bash
curl -X GET http://localhost:3000/api/submissions/team/1
```

#### Update Submission (Team Member Only)
```bash
curl -X PUT http://localhost:3000/api/submissions/1 \
  -H "Authorization: Bearer TEAM_MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated: Advanced ML model with real-time processing",
    "deckUrl": "https://docs.google.com/presentation/d/updated123"
  }'
```

#### Delete Submission (Team Leader Only)
```bash
curl -X DELETE http://localhost:3000/api/submissions/1 \
  -H "Authorization: Bearer TEAM_LEADER_TOKEN"
```

### 3. Submission Validation Testing

#### Test Invalid URLs
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer TEAM_MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "teamId": 1,
    "title": "Test Project",
    "figmaUrl": "https://invalid-figma-url.com"
  }'
```

Expected error:
```json
{
  "error": "\"figmaUrl\" with value \"https://invalid-figma-url.com\" fails to match the required pattern: /^https:\\/\\/(www\\.)?figma\\.com\\//"
}
```

#### Test Duplicate Submission
```bash
# Try to create another submission for same team/hackathon
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer TEAM_MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "teamId": 1,
    "title": "Another Project"
  }'
```

Expected error:
```json
{
  "error": "Team has already submitted for this hackathon"
}
```

#### Test Non-Team Member Submission
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer NON_MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "teamId": 1,
    "title": "Unauthorized Project"
  }'
```

Expected error:
```json
{
  "error": "Only team members can create submissions"
}
```

## Evaluation System Testing

### 1. Create Evaluation

#### Judge Evaluates Submission
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer JUDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "submissionId": 1,
    "scores": {
      "innovation": 8,
      "technical": 9,
      "presentation": 7,
      "impact": 6
    },
    "feedback": "Great technical implementation with innovative use of ML. The presentation could be improved with better visualizations. Strong potential for real-world impact."
  }'
```

Expected response:
```json
{
  "message": "Evaluation created successfully",
  "evaluation": {
    "id": 1,
    "hackathonId": 1,
    "submissionId": 1,
    "judgeId": 2,
    "scores": {
      "innovation": 8,
      "technical": 9,
      "presentation": 7,
      "impact": 6
    },
    "feedback": "Great technical implementation...",
    "judge": {
      "id": 2,
      "name": "Judge Smith",
      "email": "judge@test.com"
    },
    "submission": {
      "id": 1,
      "title": "AI Climate Tracker",
      "team": {
        "id": 1,
        "name": "Team Alpha"
      }
    }
  }
}
```

### 2. Get Evaluations

#### Get Evaluations by Submission
```bash
curl -X GET http://localhost:3000/api/evaluations/submission/1
```

#### Get Evaluations by Judge
```bash
curl -X GET http://localhost:3000/api/evaluations/judge/2/hackathon/1 \
  -H "Authorization: Bearer JUDGE_TOKEN"
```

### 3. Update Evaluation

#### Judge Updates Their Evaluation
```bash
curl -X PUT http://localhost:3000/api/evaluations/1 \
  -H "Authorization: Bearer JUDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scores": {
      "innovation": 9,
      "technical": 9,
      "presentation": 8,
      "impact": 7
    },
    "feedback": "Updated: Excellent work overall. The team addressed the presentation concerns and showed strong innovation."
  }'
```

### 4. Leaderboard Testing

#### Get Hackathon Leaderboard
```bash
curl -X GET http://localhost:3000/api/evaluations/leaderboard/1
```

Expected response:
```json
{
  "leaderboard": [
    {
      "submission": {
        "id": 1,
        "title": "AI Climate Tracker",
        "description": "ML model for climate data analysis..."
      },
      "team": {
        "id": 1,
        "name": "Team Alpha",
        "members": ["1", "2"],
        "leader": {
          "id": 1,
          "name": "John Doe",
          "email": "john@test.com"
        }
      },
      "avgScore": 8.25,
      "totalEvaluations": 1,
      "rank": 1
    }
  ],
  "hackathon": {
    "id": 1,
    "title": "AI Innovation Challenge",
    "org": "TechCorp"
  }
}
```

### 5. Evaluation Validation Testing

#### Test Invalid Score Range
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer JUDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "submissionId": 1,
    "scores": {
      "innovation": 15,
      "technical": -5
    }
  }'
```

Expected error:
```json
{
  "error": "\"scores.innovation\" must be less than or equal to 10"
}
```

#### Test Duplicate Evaluation
```bash
# Try to evaluate same submission again
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer JUDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "submissionId": 1,
    "scores": {
      "innovation": 7
    }
  }'
```

Expected error:
```json
{
  "error": "You have already evaluated this submission"
}
```

#### Test Non-Judge Evaluation
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer PARTICIPANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "submissionId": 1,
    "scores": {
      "innovation": 8
    }
  }'
```

Expected error:
```json
{
  "error": "Insufficient permissions"
}
```

## Advanced Testing Scenarios

### 1. Multi-Judge Evaluation
Create multiple judges and have them evaluate the same submission:

```bash
# Create second judge
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Judge Wilson",
    "email": "judge2@test.com",
    "role": "judge"
  }'

# Second judge evaluates
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer JUDGE2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "submissionId": 1,
    "scores": {
      "innovation": 7,
      "technical": 8,
      "presentation": 9,
      "impact": 8
    },
    "feedback": "Different perspective from Judge 2"
  }'
```

### 2. Multiple Submissions Leaderboard
Create multiple teams and submissions to test leaderboard ranking:

```bash
# Create second team and submission
# Then evaluate both submissions
# Check leaderboard shows proper ranking
```

### 3. Deadline Testing
Test submission after hackathon end date:

```bash
# Update hackathon end date to past
# Try to create/update submission
# Should fail with deadline error
```

## Database Verification

### 1. Check SQLite Database
Use DB Browser for SQLite to verify:

- **submissions table**: 
  - Unique constraint on (hackathon_id, team_id)
  - JSON URLs stored properly
  - Foreign keys working

- **evaluations table**:
  - Unique constraint on (submission_id, judge_id)
  - Scores stored as JSON TEXT
  - Foreign keys working

### 2. JSON Field Verification
Check that JSON fields are properly stored and retrieved:

```sql
-- In SQLite browser
SELECT scores FROM evaluations WHERE id = 1;
-- Should show: {"innovation":8,"technical":9,"presentation":7,"impact":6}

SELECT members FROM teams WHERE id = 1;
-- Should show: ["1","2"]
```

## Performance Testing

### 1. Leaderboard Performance
Test leaderboard with multiple submissions and evaluations:

```bash
# Create 50+ submissions and evaluations
# Time the leaderboard endpoint
curl -w "@curl-format.txt" -X GET http://localhost:3000/api/evaluations/leaderboard/1
```

### 2. Concurrent Evaluations
Test multiple judges evaluating simultaneously:

```bash
# Use Apache Bench or similar
ab -n 10 -c 5 -p evaluation.json -T application/json \
   -H "Authorization: Bearer JUDGE_TOKEN" \
   http://localhost:3000/api/evaluations
```

## Error Scenarios

### 1. Database Constraint Violations
- Duplicate submissions (team + hackathon)
- Duplicate evaluations (judge + submission)
- Invalid foreign keys

### 2. Business Logic Violations
- Non-team member creating submission
- Submission after deadline
- Judge evaluating own team's submission

### 3. Validation Errors
- Invalid URL formats
- Score out of range (0-10)
- Missing required fields

## Success Criteria

✅ **Submissions**:
- Team members can create submissions
- Only one submission per team per hackathon
- URL validation works for all platforms
- Team leader can delete submissions
- Deadline enforcement works

✅ **Evaluations**:
- Judges can evaluate submissions
- Flexible scoring system (any criteria)
- Only one evaluation per judge per submission
- Judges can update their evaluations
- Non-judges cannot evaluate

✅ **Leaderboard**:
- Proper ranking by average score
- Multiple evaluations averaged correctly
- Team and submission details included
- Real-time updates after evaluations

✅ **Database**:
- SQLite constraints enforced
- JSON fields stored/retrieved properly
- Foreign key relationships working
- Performance acceptable for expected load

This completes the Phase 3 testing coverage for submissions and evaluations!
