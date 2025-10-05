# Phase 4 Testing Guide: Real-time & Communication

## Overview
This guide covers testing the real-time communication system with Socket.io and SQLite integration.

## Prerequisites
1. Server running: `npm run dev`
2. Test users created (participant, organizer, judge)
3. Test hackathon and team created

## Socket.io Connection Testing

### 1. Frontend Socket Connection

#### HTML Test Client
Create a simple HTML file to test Socket.io connections:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.io Test Client</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
</head>
<body>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Enter message">
    <button onclick="sendMessage()">Send</button>
    
    <script>
        // Connect with JWT token
        const token = 'YOUR_JWT_TOKEN_HERE';
        const socket = io('http://localhost:3000', {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
            document.getElementById('messages').innerHTML += '<p>Connected: ' + socket.id + '</p>';
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            document.getElementById('messages').innerHTML += '<p>Error: ' + error.message + '</p>';
        });

        function sendMessage() {
            const message = document.getElementById('messageInput').value;
            socket.emit('general-message', {
                hackathonId: 1,
                message: message
            });
            document.getElementById('messageInput').value = '';
        }

        // Listen for real-time events
        socket.on('new-general-message', (data) => {
            console.log('New message:', data);
            document.getElementById('messages').innerHTML += 
                '<p><strong>' + data.message.user.name + ':</strong> ' + data.message.message + '</p>';
        });
    </script>
</body>
</html>
```

### 2. Socket Authentication Testing

#### Test Valid Token
```javascript
const socket = io('http://localhost:3000', {
    auth: { token: 'VALID_JWT_TOKEN' }
});

socket.on('connect', () => {
    console.log('✅ Authentication successful');
});
```

#### Test Invalid Token
```javascript
const socket = io('http://localhost:3000', {
    auth: { token: 'invalid_token' }
});

socket.on('connect_error', (error) => {
    console.log('❌ Authentication failed:', error.message);
});
```

#### Test Missing Token
```javascript
const socket = io('http://localhost:3000');

socket.on('connect_error', (error) => {
    console.log('❌ No token provided:', error.message);
});
```

## Communication API Testing

### 1. Announcements

#### Create Announcement (Organizer Only)
```bash
curl -X POST http://localhost:3000/api/communications/announcements \
  -H "Authorization: Bearer ORGANIZER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "title": "Important Update",
    "content": "Please note the deadline has been extended by 2 hours due to technical issues.",
    "priority": "high"
  }'
```

Expected response:
```json
{
  "message": "Announcement created successfully",
  "announcement": {
    "id": 1,
    "hackathonId": 1,
    "title": "Important Update",
    "content": "Please note the deadline has been extended...",
    "priority": "high",
    "organizer": {
      "id": 2,
      "name": "Jane Organizer",
      "email": "jane@organizer.com"
    },
    "createdAt": "2025-10-05T04:25:00.000Z"
  }
}
```

#### Get Announcements
```bash
curl -X GET http://localhost:3000/api/communications/announcements/1
```

### 2. FAQs

#### Create FAQ (Organizer Only)
```bash
curl -X POST http://localhost:3000/api/communications/faqs \
  -H "Authorization: Bearer ORGANIZER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "question": "What technologies are allowed?",
    "answer": "You can use any programming language, framework, or technology stack. However, all code must be written during the hackathon period."
  }'
```

#### Get FAQs
```bash
curl -X GET http://localhost:3000/api/communications/faqs/1
```

### 3. Questions & Answers

#### Submit Question (Any User)
```bash
curl -X POST http://localhost:3000/api/communications/questions \
  -H "Authorization: Bearer PARTICIPANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": 1,
    "question": "Can we use external APIs in our project?"
  }'
```

#### Answer Question (Organizer Only)
```bash
curl -X POST http://localhost:3000/api/communications/questions/1/answer \
  -H "Authorization: Bearer ORGANIZER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Yes, you can use external APIs, but make sure to document them properly in your submission."
  }'
```

#### Get Questions
```bash
# Get all questions
curl -X GET http://localhost:3000/api/communications/questions/1

# Get only pending questions
curl -X GET "http://localhost:3000/api/communications/questions/1?status=pending"
```

### 4. Messages

#### Get Message History
```bash
# Get general messages
curl -X GET "http://localhost:3000/api/communications/messages/1?roomType=general&page=1&limit=50"

# Get judge messages
curl -X GET "http://localhost:3000/api/communications/messages/1?roomType=judge&page=1&limit=50"
```

## Real-time Event Testing

### 1. Room Management

#### Join Hackathon Room
```javascript
socket.emit('join-hackathon-room', { hackathonId: 1 });

socket.on('joined-hackathon-room', (data) => {
    console.log('✅ Joined hackathon room:', data.hackathonId);
});
```

#### Join Judge Room (Judges Only)
```javascript
socket.emit('join-judge-room', { hackathonId: 1 });

socket.on('joined-judge-room', (data) => {
    console.log('✅ Joined judge room:', data.hackathonId);
});

socket.on('error', (error) => {
    console.log('❌ Failed to join judge room:', error.message);
});
```

#### Join User Room
```javascript
socket.emit('join-user-room');

socket.on('joined-user-room', (data) => {
    console.log('✅ Joined personal room:', data.userId);
});
```

### 2. Messaging

#### Send General Message
```javascript
socket.emit('general-message', {
    hackathonId: 1,
    message: 'Hello everyone! How is the hackathon going?'
});

// Listen for new messages
socket.on('new-general-message', (data) => {
    console.log('New message from:', data.message.user.name);
    console.log('Message:', data.message.message);
});
```

#### Send Judge Message (Judges Only)
```javascript
socket.emit('judge-message', {
    hackathonId: 1,
    message: 'Discussion about evaluation criteria'
});

socket.on('new-judge-message', (data) => {
    console.log('Judge message:', data.message);
});
```

### 3. Real-time Notifications

#### Team Registration Event
```javascript
// Listen for team registrations
socket.on('team-registered', (data) => {
    console.log('New team registered:', data.team.name);
    console.log('Hackathon:', data.hackathon.title);
});
```

#### Submission Events
```javascript
// Listen for new submissions
socket.on('submission-created', (data) => {
    console.log('New submission:', data.submission.title);
});

// Listen for submission notifications (judges)
socket.on('new-submission-notification', (data) => {
    console.log('New submission to evaluate:', data.submission.title);
});
```

#### Evaluation Events
```javascript
// Listen for new evaluations
socket.on('evaluation-added', (data) => {
    console.log('New evaluation by:', data.evaluation.judge.name);
});

// Listen for evaluation notifications (team members)
socket.on('evaluation-notification', (data) => {
    console.log('Your submission was evaluated!');
});

// Listen for leaderboard updates
socket.on('leaderboard-update-needed', (data) => {
    console.log('Leaderboard needs refresh for hackathon:', data.hackathonId);
});
```

#### Announcement Events
```javascript
socket.on('new-announcement', (data) => {
    console.log('New announcement:', data.announcement.title);
    console.log('Priority:', data.announcement.priority);
});
```

#### Question Events
```javascript
// For organizers - new questions
socket.on('new-question', (data) => {
    console.log('New question from:', data.question.user.name);
    console.log('Question:', data.question.question);
});

// For question askers - answers
socket.on('question-answered', (data) => {
    console.log('Your question was answered!');
    console.log('Answer:', data.question.answer);
});
```

### 4. Typing Indicators

#### Start Typing
```javascript
socket.emit('typing-start', { 
    hackathonId: 1, 
    roomType: 'general' 
});

socket.on('user-typing', (data) => {
    console.log(data.userName + ' is typing...');
});
```

#### Stop Typing
```javascript
socket.emit('typing-stop', { 
    hackathonId: 1, 
    roomType: 'general' 
});

socket.on('user-stopped-typing', (data) => {
    console.log('User stopped typing');
});
```

### 5. Team Progress Updates

#### Update Team Progress
```javascript
socket.emit('team-progress-update', {
    hackathonId: 1,
    teamId: 1,
    stage: 'development',
    progress: 75
});

socket.on('team-progress-updated', (data) => {
    console.log('Team progress update:', data.stage, data.progress + '%');
    console.log('Updated by:', data.updatedBy);
});
```

## Error Handling Testing

### 1. Authentication Errors
```javascript
// Test expired token
const expiredSocket = io('http://localhost:3000', {
    auth: { token: 'expired_token' }
});

expiredSocket.on('connect_error', (error) => {
    console.log('Expected error:', error.message);
});
```

### 2. Permission Errors
```javascript
// Try to join judge room as participant
socket.emit('join-judge-room', { hackathonId: 1 });

socket.on('error', (error) => {
    console.log('Expected permission error:', error.message);
});
```

### 3. Validation Errors
```javascript
// Send message without required fields
socket.emit('general-message', {
    hackathonId: 1
    // missing message field
});

socket.on('error', (error) => {
    console.log('Expected validation error:', error.message);
});
```

## Database Verification

### 1. Check Message Storage
```sql
-- In SQLite browser
SELECT * FROM messages WHERE hackathon_id = 1 ORDER BY created_at DESC;
```

### 2. Check Communication Tables
```sql
-- Announcements
SELECT * FROM announcements WHERE hackathon_id = 1;

-- FAQs
SELECT * FROM faqs WHERE hackathon_id = 1;

-- Questions
SELECT * FROM questions WHERE hackathon_id = 1;
```

## Performance Testing

### 1. Concurrent Connections
```javascript
// Create multiple socket connections
const sockets = [];
for (let i = 0; i < 100; i++) {
    const socket = io('http://localhost:3000', {
        auth: { token: 'VALID_TOKEN' }
    });
    sockets.push(socket);
}
```

### 2. Message Load Testing
```javascript
// Send multiple messages rapidly
for (let i = 0; i < 50; i++) {
    socket.emit('general-message', {
        hackathonId: 1,
        message: `Test message ${i}`
    });
}
```

### 3. Room Management Testing
```javascript
// Join/leave rooms rapidly
for (let i = 0; i < 20; i++) {
    socket.emit('join-hackathon-room', { hackathonId: 1 });
    setTimeout(() => {
        socket.emit('leave-hackathon-room', { hackathonId: 1 });
    }, 100);
}
```

## Integration Testing

### 1. Full Communication Flow
1. User joins hackathon room
2. Organizer creates announcement
3. All users receive announcement notification
4. User asks question
5. Organizer answers question
6. User receives answer notification

### 2. Judge Workflow
1. Judge joins judge room
2. Team submits project
3. Judge receives submission notification
4. Judge evaluates submission
5. Team receives evaluation notification
6. Leaderboard update triggered

### 3. Team Collaboration
1. Team members join hackathon room
2. Team leader updates progress
3. All hackathon participants see progress update
4. Team submits final project
5. Real-time submission notification sent

## Success Criteria

✅ **Socket.io Authentication**:
- JWT token validation working
- Role-based room access enforced
- Proper error handling for invalid tokens

✅ **Real-time Communication**:
- Messages stored in SQLite and broadcast in real-time
- Room-based communication working (hackathon, judge, user rooms)
- Typing indicators functioning
- Connection/disconnection handling

✅ **Communication APIs**:
- Announcements CRUD with real-time notifications
- FAQ management system
- Question/answer workflow with notifications
- Message history retrieval with pagination

✅ **Real-time Events**:
- Team registration broadcasts
- Submission notifications to judges
- Evaluation notifications to teams
- Leaderboard update triggers
- Announcement broadcasts

✅ **Database Integration**:
- All messages persisted in SQLite
- Communication models with proper associations
- Efficient queries with pagination
- Foreign key relationships working

✅ **Error Handling**:
- Socket authentication errors handled gracefully
- Permission validation for room access
- Database error handling for message storage
- Rate limiting and connection management

This completes the Phase 4 testing coverage for real-time communication and Socket.io integration!
