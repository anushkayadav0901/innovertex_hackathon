import React from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import type { Role } from '@/store/types'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const currentUserId = useStore(s => s.session.currentUserId)
  if (!currentUserId) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function RequireRole({ role, children }: { role: Role | Role[]; children: React.ReactNode }) {
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const roles = Array.isArray(role) ? role : [role]
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}
