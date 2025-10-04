# Mentor Dashboard Testing Guide

## ✅ What's Been Fixed

### 1. **Seed Data Added**
- **Mentor Account**: sarah@mentor.com (Sarah Johnson)
- **Participant Accounts**: 
  - alex@example.com (Alex Chen)
  - maria@example.com (Maria Garcia)
- **Teams**: Code Warriors, AI Innovators, Web Wizards
- **Help Requests**: 3 sample requests (2 pending, 1 resolved)

### 2. **Help Request System**
- Teams can create help requests from Participant Dashboard
- Mentors see all requests with filters
- Real-time activity tracking

### 3. **Store Migration**
- Version bumped to 3
- Old data will be migrated to include new seed data

## 🧪 How to Test

### Step 1: Login as Mentor
1. Go to `/login`
2. Email: `sarah@mentor.com`
3. Select Role: **Mentor**
4. Click Sign in

### Step 2: View Mentor Dashboard
1. Navigate to `/mentor`
2. You should see:
   - **Stats Cards**: Pending (2), Urgent (1), Resolved by You (1)
   - **Help Request Tracker**: 2 pending requests visible
   - **Activity Log**: Shows resolved request from earlier

### Step 3: Test Mentor Actions
1. **Click on a help request** in the tracker
2. Right panel shows:
   - Team Profile (Code Warriors or AI Innovators)
   - Project details
   - Members list
3. **Send a message** in Chat & Support panel
4. **Mark request as resolved** using button in tracker

### Step 4: Login as Participant (Test Creating Requests)
1. Logout
2. Login as `alex@example.com` (Participant)
3. Go to `/dashboard`
4. Scroll to "Request Help from Mentors" section
5. Click "New Request"
6. Fill form:
   - Select Team: Code Warriors
   - Message: "Need help with deployment"
   - Priority: Urgent
7. Submit

### Step 5: Verify as Mentor
1. Logout and login as `sarah@mentor.com` (Mentor)
2. Go to `/mentor`
3. New request should appear in tracker
4. Urgent badge should show in stats

## 🎯 Features to Test

### Help Request Tracker
- [x] Filter by All/Urgent/Pending/Resolved
- [x] Search by team name or message
- [x] Click to select request
- [x] Priority badges (Urgent = red, Normal = amber)
- [x] Status badges (Pending = blue, Resolved = green)
- [x] Mark as Resolved button

### Team Profile
- [x] Shows team name and hackathon
- [x] Displays project title
- [x] Lists team members
- [x] Shows progress stage

### Chat & Support
- [x] Textarea for guidance
- [x] Send button (creates activity log entry)
- [x] Disabled when no request selected

### Activity Log
- [x] Shows today's activities only
- [x] Different icons for chat/feedback/resolved
- [x] Timestamps
- [x] Team names

### Notification System
- [x] Bell icon in header
- [x] Red pulsing badge for urgent count
- [x] Stats update in real-time

## 🐛 Common Issues

### "No requests found"
- **Solution**: Make sure you're logged in as mentor
- Clear localStorage and refresh to load seed data
- Create a new request as participant first

### Stats show 0
- **Solution**: Seed data might not have loaded
- Go to browser DevTools → Application → Local Storage
- Delete `innovortex-store` entry
- Refresh page

### Can't login as mentor
- **Solution**: 
  - Make sure email is exactly `sarah@mentor.com`
  - Select "Mentor" from role dropdown
  - If user doesn't exist, go to Signup and create with Mentor role

## 📊 Expected Data

After fresh load, you should see:

**Mentor Dashboard:**
- Pending: 2 requests
- Urgent: 1 request  
- Resolved by You: 1 request

**Help Requests:**
1. "Need help with React state management" - Code Warriors (Urgent, Pending)
2. "Looking for advice on choosing the right ML model" - AI Innovators (Normal, Pending)
3. "Database schema design review needed" - Web Wizards (Normal, Resolved)

**Teams:**
- Code Warriors (2 members, Smart Health Tracker project)
- AI Innovators (1 member, EduBot AI project)
- Web Wizards (1 member, no submission yet)

## 🚀 What Works Now

✅ Mentor can view all help requests  
✅ Real-time filtering and search  
✅ Team profile viewer with project context  
✅ Chat/support messaging  
✅ Activity tracking  
✅ Resolve requests  
✅ Notification badges  
✅ Participants can create requests  
✅ Store persistence with migration
