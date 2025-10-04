import type { RouteObject } from 'react-router-dom'
import App from './App'
import Landing from './pages/Landing'
import Discover from './pages/Discover'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import HackathonDetail from './pages/HackathonDetail'
import Dashboard from './pages/Dashboard/Dashboard'
import SubmissionPortal from './pages/SubmissionPortal'
import EvaluateSubmission from './pages/EvaluateSubmission'
import Leaderboard from './pages/Leaderboard'
import { RequireAuth } from './components/Protected'
import CreateHackathon from './pages/Organizer/CreateHackathon'
import CommunicationHub from './pages/Comms/CommunicationHub'
import Gamify from './pages/Gamify'
import Gallery from './pages/Gallery'
import Teams from './pages/Teams'
import Community from './pages/Community'
import JudgeDashboard from './pages/Dashboard/JudgeDashboard'
import MentorDashboard from './pages/Dashboard/MentorDashboard'
import HackathonQuestMap from './pages/HackathonQuestMap'
import EnhancedHackathonQuestMap from './pages/EnhancedHackathonQuestMap'
import Simple3DTest from './components/Simple3DTest'
import SimpleQuestMap from './pages/SimpleQuestMap'
import StepByStepQuestMap from './pages/StepByStepQuestMap'
import HackathonUniverseSystem from './pages/HackathonUniverseSystem'
import SearchInterface from './components/SearchInterface'
import PerformanceDemo from './pages/PerformanceDemo'
import FoodScan from './pages/FoodScan'
import ManageHackathon from './pages/Organizer/ManageHackathon'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'discover', element: <Discover /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'hackathons/:id', element: <HackathonDetail /> },
      { path: 'dashboard', element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ) },
      { path: 'submission/:hackathonId/:teamId', element: (
          <RequireAuth>
            <SubmissionPortal />
          </RequireAuth>
        ) },
      { path: 'evaluate/:submissionId', element: (
          <RequireAuth>
            <EvaluateSubmission />
          </RequireAuth>
        ) },
      { path: 'judge/:hackathonId', element: (
          <RequireAuth>
            <JudgeDashboard />
          </RequireAuth>
        ) },
      { path: 'mentor', element: (
          <RequireAuth>
            <MentorDashboard />
          </RequireAuth>
        ) },
      { path: 'mentor/:hackathonId', element: (
          <RequireAuth>
            <MentorDashboard />
          </RequireAuth>
        ) },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'progress', element: <Gamify /> },
      { path: 'gamify', element: <Gamify /> },
      { path: 'quest-map', element: <HackathonUniverseSystem /> },
      { path: 'quest-map-basic', element: <HackathonQuestMap /> },
      { path: 'quest-map-enhanced', element: <EnhancedHackathonQuestMap /> },
      { path: 'quest-map-simple', element: <SimpleQuestMap /> },
      { path: 'quest-map-demo', element: <StepByStepQuestMap /> },
      { path: 'universe', element: <HackathonUniverseSystem /> },
      { path: 'search', element: <SearchInterface /> },
      { path: 'performance', element: <PerformanceDemo /> },
      { path: '3d-test', element: <Simple3DTest /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'teams', element: <Teams /> },
      { path: 'community', element: <Community /> },
      { path: 'food-scan', element: <FoodScan /> },
      { path: 'organizer/create', element: (
          <RequireAuth>
            <CreateHackathon />
          </RequireAuth>
        ) },
      { path: 'organizer/manage/:id', element: (
          <RequireAuth>
            <ManageHackathon />
          </RequireAuth>
        ) },
      { path: 'comms/:id', element: <CommunicationHub /> },
    ],
  },
]
