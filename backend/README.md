# Innovertex Hackathon Platform - Backend API

A comprehensive Node.js backend for the Innovertex Hackathon Platform with TypeScript, PostgreSQL, and real-time features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

3. **Database Setup**
```bash
# Create PostgreSQL database
createdb innovertex_hackathon

# Run schema
psql -d innovertex_hackathon -f schema.sql
```

4. **Start Development Server**
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Database & app configuration
│   ├── models/           # Sequelize models
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation middleware
│   ├── utils/            # Helper utilities
│   └── app.ts           # Main application file
├── schema.sql           # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hackathons
- `GET /api/hackathons` - List all hackathons (with filters)
- `GET /api/hackathons/:id` - Get hackathon details
- `POST /api/hackathons` - Create hackathon (organizers only)
- `PUT /api/hackathons/:id` - Update hackathon (organizers only)
- `DELETE /api/hackathons/:id` - Delete hackathon (organizers only)

### Teams
- `POST /api/teams` - Create team (participants only)
- `POST /api/teams/:teamId/join` - Join team
- `DELETE /api/teams/:teamId/leave` - Leave team
- `GET /api/teams/my-teams` - Get user's teams
- `GET /api/teams/:id` - Get team details

### Submissions
- `POST /api/submissions/:hackathonId/:teamId` - Create/update submission
- `GET /api/submissions/hackathon/:hackathonId` - Get hackathon submissions
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/my-submissions` - Get user's submissions
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Evaluations
- `POST /api/evaluations/submission/:submissionId` - Create evaluation (judges only)
- `GET /api/evaluations/submission/:submissionId` - Get submission evaluations
- `GET /api/evaluations/my-evaluations` - Get judge's evaluations
- `GET /api/evaluations/pending` - Get pending evaluations for judge
- `GET /api/evaluations/leaderboard/:hackathonId` - Get hackathon leaderboard
- `PUT /api/evaluations/:id` - Update evaluation

## 🔐 Authentication & Authorization

### JWT Authentication
- All protected routes require `Authorization: Bearer <token>` header
- Tokens expire in 7 days (configurable)
- Role-based access control (participant, organizer, judge, mentor)

### User Roles
- **Participant**: Can join teams, submit projects
- **Organizer**: Can create/manage hackathons
- **Judge**: Can evaluate submissions
- **Mentor**: Can provide guidance (future feature)

## 🌐 Real-time Features (Socket.IO)

### Events
- `join-hackathon` - Join hackathon room for real-time updates
- `judge-message` - Real-time judge chat
- `team-progress` - Team progress updates
- `new-submission` - New submission notifications
- `new-evaluation` - New evaluation notifications

### Usage Example
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Join hackathon room
socket.emit('join-hackathon', hackathonId);

// Listen for real-time updates
socket.on('team-progress-update', (data) => {
  console.log('Team progress:', data);
});
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `hackathons` - Hackathon events
- `teams` - Team registrations
- `team_members` - Team membership junction table
- `submissions` - Project submissions
- `evaluations` - Judge evaluations

### Features Tables
- `announcements` - Hackathon announcements
- `faqs` - Frequently asked questions
- `questions` - Q&A system
- `judge_chats` - Judge communication
- `food_coupon_windows` - Food coupon system
- `food_redemption_records` - Coupon redemptions

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=innovertex_hackathon
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"participant"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🔒 Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- Input validation with Joi
- SQL injection prevention with Sequelize ORM
- CORS protection
- JWT token authentication
- Password hashing with bcrypt

## 📊 Performance

- Database connection pooling
- Request compression with gzip
- Efficient database queries with proper indexing
- Pagination for large datasets
- Caching strategies (Redis recommended for production)

## 🐛 Error Handling

- Comprehensive error middleware
- Structured error responses
- Development vs production error details
- Database constraint error handling
- Validation error formatting

## 🔄 Frontend Integration

This backend is designed to work seamlessly with the existing React frontend. The API responses match the expected data structures from the frontend's Zustand store.

### Key Integration Points
- Authentication tokens stored in localStorage
- Real-time updates via Socket.IO
- File upload support for submissions
- Leaderboard calculations
- Team management workflows

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // for paginated results
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Detailed error information" // development only
}
```

## 🎯 Next Steps

1. **File Upload**: Implement AWS S3 integration for file uploads
2. **Email Notifications**: Add email service for important updates
3. **Caching**: Implement Redis for better performance
4. **Monitoring**: Add application monitoring and logging
5. **Testing**: Add comprehensive test suite
6. **Documentation**: Generate API documentation with Swagger

---

**Ready to connect with your React frontend!** 🎉

The backend provides all the APIs your frontend expects, maintaining the same data structure while adding real-time capabilities and proper authentication.
