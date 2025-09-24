import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render nested routes if using RouterProvider inside children, otherwise use Outlet */}
        {children ? children : <Outlet />}
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Innovortex Hackathons — Built for creators and problem solvers.
      </footer>
    </div>
  )
}
