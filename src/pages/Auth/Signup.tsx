import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import type { Role } from '@/store/types'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('participant')
  const [error, setError] = useState<string | null>(null)
  const signup = useStore(s => s.signup)
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name || !email) {
      setError('Please fill in name and email')
      return
    }
    try {
      signup(name, email, role)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Unable to sign up')
    }
  }

  return (
    <div className="mx-auto max-w-md card p-6">
      <h2 className="text-xl font-semibold">Create your account</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input className="input mt-1" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
        </div>
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
          </select>
        </div>
        <button className="btn-primary w-full" type="submit">Sign up</button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}
