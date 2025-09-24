# Innovortex Hackathon Platform

A modern, visually appealing hackathon hosting platform built with React + TypeScript + Vite and Tailwind CSS. It includes full, clickable flows for organizers, participants, and judges — from discovery and registration to submissions, evaluations, and leaderboards — with a Communication Hub for announcements, FAQs, and Q&A.

This project is fully client-side and persists data in `localStorage` (no backend required) so you can demo end-to-end flows instantly.

## Tech Stack
- React 18 + TypeScript (Vite)
- React Router v6
- Tailwind CSS
- Zustand (global state + localStorage persistence)
- Lucide/Heroicons for icons
- Recharts (placeholder for analytics)

## Prerequisites
- Node.js 18+ (recommended 18 or 20)
- npm 9+

## Getting Started

1) Install dependencies
```
npm install
```

2) Start the dev server
```
npm run dev
```
- Open the URL shown in the terminal (usually http://localhost:5173)

3) Build for production (optional)
```
npm run build
```
- Preview the production build locally:
```
npm run preview
```

## Project Structure
```
.
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ router.tsx
   ├─ utils/
   │  └─ id.ts
   ├─ store/
   │  ├─ types.ts
   │  └─ useStore.ts
   ├─ components/
   │  ├─ Navbar.tsx
   │  └─ Protected.tsx
   ├─ pages/
   │  ├─ Landing.tsx
   │  ├─ Discover.tsx
   │  ├─ HackathonDetail.tsx
   │  ├─ Leaderboard.tsx
   │  ├─ SubmissionPortal.tsx
   │  ├─ EvaluateSubmission.tsx
   │  ├─ Auth/
   │  │  ├─ Login.tsx
   │  │  └─ Signup.tsx
   │  ├─ Dashboard/
   │  │  ├─ Dashboard.tsx
   │  │  ├─ ParticipantDashboard.tsx
   │  │  ├─ OrganizerDashboard.tsx
   │  │  └─ JudgeDashboard.tsx
   │  ├─ Organizer/
   │  │  └─ CreateHackathon.tsx
   │  └─ Comms/
   │     └─ CommunicationHub.tsx
```

## Core Features
- Discover hackathons with tags, date ranges, and prizes (`/discover`)
- Authentication
  - Signup with role: Participant, Organizer, Judge
  - Login by email
  - Logout
  - Data persisted with Zustand `persist` in localStorage
- Hackathon Detail
  - Overview, tags, judging criteria
  - Team registration (participants)
  - Links back to Discover
- Dashboards (`/dashboard`)
  - Participant: teams, submissions, quick links to Submission Portal
  - Organizer: list of hackathons, create hackathon, open Communication Hub
  - Judge: queue of submissions to evaluate
- Submissions & Evaluations
  - Submission Portal: title, description, repo, Figma, Drive, deck links
  - Evaluations: score by criteria + feedback
  - Leaderboard: computed totals from evaluations
- Communication Hub (per hackathon)
  - Announcements (organizer posts)
  - FAQs (organizer adds Q/A)
  - Q&A: participants ask, organizers answer
- Gamification Dashboard (`/gamify`)
  - Animated progress bars with CSS keyframes for hackathon stages
  - Floating achievement badges with Framer Motion hover effects
  - Interactive leaderboard with smooth sorting animations
  - Particle celebration effects (Canvas) for milestones
  - Gradient glassmorphism stat cards for user metrics
  - Streak counter with fire emoji glow and spark animations
  - Responsive badge collection using CSS Grid
  - Dark/Light theme toggle with smooth transitions

## Routes Overview
- Public
  - `/` — Landing
  - `/discover` — Hackathon discovery
  - `/hackathons/:id` — Hackathon detail, registration UI
  - `/leaderboard` — Leaderboard across submissions
  - `/gamify` — Gamification dashboard showcase
  - `/comms/:id` — Communication Hub view (posting requires auth)
  - `/login` — Login by email
  - `/signup` — Signup with role
- Protected (requires login)
  - `/dashboard` — Role-based dashboard
  - `/submission/:hackathonId/:teamId` — Submission Portal
  - `/evaluate/:submissionId` — Judge evaluation form
  - `/organizer/create` — Create Hackathon (organizers)

Note: Role checks are done in-UI (client side). Organizer-only actions are guarded by login and visibility rules. For production scenarios, enforce permissions server-side.

## Using the App (Typical Flow)
- Participant
  1. Sign up as `Participant`.
  2. Open `/discover`, click a hackathon → Register a team.
  3. Open `/dashboard` → "Your Teams" → "Open Submission Portal".
  4. Submit project links and details.
- Judge
  1. Sign up as `Judge`.
  2. Open `/dashboard` → evaluate available submissions.
  3. Submit scores and feedback.
  4. Check `/leaderboard` for rankings.
- Organizer
  1. Sign up as `Organizer`.
  2. Open `/dashboard` → "Create New Hackathon".
  3. Fill details and dynamic judging criteria → Create.
  4. Open "Communication Hub" for the hackathon to post announcements, FAQs, and answer Q&A.

## Data & Persistence
- State lives in `src/store/useStore.ts` using Zustand.
- Data is persisted in the browser via localStorage (`innovortex-store`).
- Seed data includes one example hackathon ("Innovortex 4.0").
- To reset data, clear browser site storage for the app.

## Styling & UI
- Tailwind utility classes are used throughout.
- Reusable helper classes located in `src/index.css`:
  - `.btn-primary`, `.card`, `.badge`, `.input`.

## Troubleshooting
- If `npm run dev` doesn’t open automatically, navigate to the URL shown (e.g. http://localhost:5173).
- Ensure Node.js 18+ is installed: `node -v`.
- Port conflicts: specify another port by running `vite --port 5174` or set the `VITE_PORT` env.
- If styles don’t load, ensure Tailwind is installed and `@tailwind` directives exist in `src/index.css`.

## Notes for Production
- This demo uses client-only persistence to showcase UX and flows.
- For a real deployment, add a backend (e.g., Firebase, Supabase, or Node/Express + DB) to handle:
  - Authentication & sessions
  - Role-based authorization
  - Hackathon, team, submission CRUD
  - Evaluations and leaderboards
  - Real-time updates for Communications (WebSockets)
- Add API keys via environment variables (do not commit secrets).

---

If you want, I can add a deploy workflow (Netlify/Vercel) and a sample backend schema or wire up integrations (GitHub, Figma, Google Drive).

## Gamification Dashboard (`/gamify`)

This page showcases a modern gamified experience:

- Animated progress bars with CSS keyframes for hackathon stages.
- Floating achievement badges with Framer Motion hover effects.
- Interactive leaderboard with smooth sorting animations.
- Particle celebration effects (Canvas) for milestones.
- Gradient glassmorphism stat cards for user metrics.
- Streak counter with fire emoji glow and spark animations.
- Responsive badge collection using CSS Grid.
- Dark/Light theme toggle with smooth transitions.

Access it via the navbar link “Gamify” or open `/gamify` directly after running the dev server.

### Theme Toggle

The app uses a simple Theme Provider and a navbar toggle button to switch between dark and light. The background and cards respond via CSS variables for smooth transitions.
