import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export default function Login() {
  const [email, setEmail] = useState('')
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
        <button className="btn-primary w-full" type="submit">Sign in</button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}
