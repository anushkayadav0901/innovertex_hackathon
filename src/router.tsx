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
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'gamify', element: <Gamify /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'teams', element: <Teams /> },
      { path: 'community', element: <Community /> },
      { path: 'organizer/create', element: (
          <RequireAuth>
            <CreateHackathon />
          </RequireAuth>
        ) },
      { path: 'comms/:id', element: <CommunicationHub /> },
    ],
  },
]
