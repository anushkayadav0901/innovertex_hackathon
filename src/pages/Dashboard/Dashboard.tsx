import React from 'react'
import { useStore } from '@/store/useStore'
import ParticipantDashboard from './ParticipantDashboard'
import OrganizerDashboard from './OrganizerDashboard'
import JudgeDashboard from './JudgeDashboard'

export default function Dashboard() {
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  if (!user) return null
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Welcome, {user.name}</h1>
      {user.role === 'participant' && <ParticipantDashboard />}
      {user.role === 'organizer' && <OrganizerDashboard />}
      {user.role === 'judge' && <JudgeDashboard />}
    </div>
  )
}
