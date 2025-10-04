import { useEffect, useMemo, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

type Position = 'top' | 'right' | 'bottom' | 'left' | 'center'

type TourStep = {
  id: string
  target: string
  title: string
  content: string
  position?: Position
  navigateTo?: string
}

// Define route-aware tours so Next can navigate between pages
const ROUTE_TOURS: Record<string, TourStep[]> = {
  '/': [
    {
      id: 'welcome',
      target: 'body',
      title: 'Welcome to Innovortex!',
      content: 'Let us guide you through the platform to help you get started.',
      position: 'center'
    },
    {
      id: 'navigation',
      target: 'header, header[role="banner"], .site-header',
      title: 'Main Navigation',
      content: 'Use this menu to navigate between different sections of the platform.',
      position: 'bottom'
    },
    {
      id: 'cta',
      target: '.hero-cta, .btn-primary, main',
      title: 'Get Started',
      content: 'Use these buttons to start building or explore the community.',
      position: 'bottom',
      navigateTo: '/discover'
    },
  ],
  '/discover': [
    {
      id: 'browse',
      target: '.hackathon-list, main',
      title: 'Browse Hackathons',
      content: 'Filter and explore hackathons here.',
      position: 'right'
    },
    {
      id: 'next-dashboard',
      target: 'header, header[role="banner"], .site-header',
      title: 'Your Dashboard',
      content: 'Track your projects and progress from your dashboard.',
      position: 'bottom',
      navigateTo: '/dashboard'
    }
  ],
  '/dashboard': [
    {
      id: 'cards',
      target: 'main',
      title: 'Your Dashboard',
      content: 'Manage your projects and see your learning journey here.',
      position: 'bottom'
    }
  ]
}

export function GuidedTour() {
  const { 
    isBeginnerMode, 
    currentTourStep, 
    nextTourStep, 
    prevTourStep, 
    endTour,
    completeTour,
    showOnlySecondStep,
    clearSecondStepTour
  } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const steps = useMemo(() => ROUTE_TOURS[location.pathname] || ROUTE_TOURS['/'], [location.pathname])
  
  // When quick mode is active, lock to step index 1 (fallback to 0 if not present)
  const effectiveStepIndex = showOnlySecondStep ? Math.min(1, Math.max(0, steps.length - 1)) : currentTourStep
  const currentStep = steps[effectiveStepIndex]
  const targetRef = useRef<HTMLElement | null>(null)
  
  useEffect(() => {
    if (isBeginnerMode && currentStep) {
      targetRef.current = document.querySelector(currentStep.target)
    }
  }, [isBeginnerMode, currentStep])
  
  if (!isBeginnerMode || effectiveStepIndex === -1 || !currentStep) {
    return null
  }
  
  const targetRect = targetRef.current?.getBoundingClientRect()
  const position = currentStep.position || 'bottom'
  
  let tooltipStyle: React.CSSProperties = {}
  
  if (targetRect) {
    switch (position) {
      case 'top':
        tooltipStyle = {
          top: targetRect.top - 10,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, -100%)'
        }
        break
      case 'right':
        tooltipStyle = {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + 10,
          transform: 'translateY(-50%)'
        }
        break
      case 'left':
        tooltipStyle = {
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + 10,
          transform: 'translateY(-50%)'
        }
        break
      case 'center':
        tooltipStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
        break
      default: // bottom
        tooltipStyle = {
          top: targetRect.bottom + 10,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)'
        }
    }
  }
  
  return (
    <div className="fixed inset-0 z-40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 pointer-events-auto"
          onClick={endTour}
        />
        
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-[1000] w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden pointer-events-auto"
            style={tooltipStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentStep.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentStep.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-1">
                {!showOnlySecondStep && steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === effectiveStepIndex 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                {!showOnlySecondStep && effectiveStepIndex > 0 && (
                  <button
                    onClick={prevTourStep}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Back
                  </button>
                )}
                
                {showOnlySecondStep ? (
                  <button
                    onClick={() => { clearSecondStepTour(); endTour(); }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  effectiveStepIndex < steps.length - 1 ? (
                    <button
                      onClick={() => {
                        // If this step wants to navigate next, do it
                        const nextStep = steps[effectiveStepIndex + 1]
                        if (currentStep.navigateTo) {
                          navigate(currentStep.navigateTo)
                          // reset to first step on new page
                          setTimeout(() => {
                            // start at 0 on next route
                            prevTourStep(); // ensure state change even if already 0
                            nextTourStep();
                          }, 0)
                        } else {
                          nextTourStep()
                        }
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        completeTour('main')
                        endTour()
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    >
                      Got it!
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
