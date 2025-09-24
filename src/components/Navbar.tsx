import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Rocket, LogIn, UserPlus, Sun, Moon } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useTheme } from '@/components/theme/ThemeProvider'
import NotificationBell from '@/components/community/NotificationBell'

export default function Navbar() {
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const logout = useStore(s => s.logout)
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Rocket className="h-6 w-6 text-brand-400" />
          <span>Innovortex</span>
        </Link>
        <nav className="hidden gap-6 md:flex items-center">
          <NavLink to="/discover" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Discover</NavLink>
          <NavLink to="/teams" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Teams</NavLink>
          <NavLink to="/community" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Community</NavLink>
          <NavLink to="/gallery" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Gallery</NavLink>
          <NavLink to="/gamify" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Gamify</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Dashboard</NavLink>
              <NotificationBell />
              <span className="badge capitalize">{user.role}</span>
              <button onClick={logout} className="btn-primary bg-white/10 hover:bg-white/20">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Login</NavLink>
              <NavLink to="/signup" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Sign up</NavLink>
            </>
          )}
          <button aria-label="Toggle theme" onClick={toggle} className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-primary">Dashboard</Link>
              <button onClick={logout} className="btn-primary bg-white/10 hover:bg-white/20">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary"><LogIn className="h-4 w-4"/> Login</Link>
              <Link to="/signup" className="btn-primary"><UserPlus className="h-4 w-4"/> Sign up</Link>
            </>
          )}
          <button aria-label="Toggle theme" onClick={toggle} className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
