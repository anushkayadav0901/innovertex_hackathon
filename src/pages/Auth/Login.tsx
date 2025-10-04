import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import type { Role } from '@/store/types'

export default function Login() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('participant')
  const [error, setError] = useState<string | null>(null)
  const login = useStore(s => s.login)
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) {
      setError('Please enter your email')
      return
    }
    try {
      login(email)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Unable to login')
    }
  }

  return (
    <div className="mx-auto max-w-md card p-6">
      <h2 className="text-xl font-semibold">Login</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input className="input mt-1" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-300">Role</label>
          <select className="input mt-1" value={role} onChange={e => setRole(e.target.value as Role)}>
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
            <option value="judge">Judge</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
        <button className="btn-primary w-full" type="submit">Sign in</button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}
