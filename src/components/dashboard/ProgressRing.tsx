import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  label?: string
  showPercentage?: boolean
  duration?: number
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b5cff',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  label,
  showPercentage = true,
  duration = 2
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    setIsVisible(true)
    
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progressValue = Math.min((elapsed / (duration * 1000)) * progress, progress)
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - (progressValue / progress), 4)
      setAnimatedProgress(progress * easeOutQuart)
      
      if (elapsed < duration * 1000) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [progress, duration])

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring-circle"
            style={{
              '--initial-offset': circumference,
              '--final-offset': offset,
              filter: 'drop-shadow(0 0 6px rgba(59, 92, 255, 0.4))'
            } as React.CSSProperties}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <motion.span
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: duration * 0.5, duration: 0.5 }}
            >
              {Math.round(animatedProgress)}%
            </motion.span>
          )}
          {label && (
            <motion.span
              className="text-xs text-slate-400 text-center mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: duration * 0.7, duration: 0.5 }}
            >
              {label}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
