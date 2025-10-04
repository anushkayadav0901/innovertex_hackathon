import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { GuidedTour } from './components/beginner-mode'
// Help UI removed per request
import { useStore } from './store/useStore'

export default function App({ children }: { children?: React.ReactNode }) {
  const { isBeginnerMode, showTooltips } = useStore()
  
  // Add a class to the body when in beginner mode for global styling
  useEffect(() => {
    if (isBeginnerMode) {
      document.body.classList.add('beginner-mode')
      if (showTooltips) {
        document.body.classList.add('show-tooltips')
      } else {
        document.body.classList.remove('show-tooltips')
      }
    } else {
      document.body.classList.remove('beginner-mode', 'show-tooltips')
    }
    
    return () => {
      document.body.classList.remove('beginner-mode', 'show-tooltips')
    }
  }, [isBeginnerMode, showTooltips])
  return (
    <div className="app-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render nested routes if using RouterProvider inside children, otherwise use Outlet */}
        {children ? children : <Outlet />}
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Innovortex Hackathons — Built for creators and problem solvers.
      </footer>
      {/* Beginner mode components */}
      <GuidedTour />
      
      {/* Film grain overlay for subtle texture */}
      <div className="grain" />
    </div>
  )
}
