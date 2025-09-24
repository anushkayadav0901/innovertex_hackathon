import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Skill {
  name: string
  level: number
}

interface SkillVisualizationProps {
  skills: Skill[]
  showLabels?: boolean
  compact?: boolean
}

export default function SkillVisualization({ skills, showLabels = true, compact = false }: SkillVisualizationProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-emerald-400 to-emerald-600'
    if (level >= 75) return 'from-blue-400 to-blue-600'
    if (level >= 60) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getSkillBadge = (level: number) => {
    if (level >= 90) return { label: 'Expert', color: 'text-emerald-400' }
    if (level >= 75) return { label: 'Advanced', color: 'text-blue-400' }
    if (level >= 60) return { label: 'Intermediate', color: 'text-yellow-400' }
    return { label: 'Beginner', color: 'text-red-400' }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={skill.name} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white truncate">{skill.name}</span>
                <span className="text-xs text-slate-400">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} skill-bar`}
                  style={{ 
                    '--skill-level': `${skill.level}%`,
                    '--animation-delay': `${index * 0.1}s`
                  } as React.CSSProperties}
                  initial={{ width: 0 }}
                  animate={{ width: mounted ? `${skill.level}%` : 0 }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => {
        const badge = getSkillBadge(skill.level)
        return (
          <motion.div
            key={skill.name}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{skill.name}</span>
                {showLabels && (
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${badge.color}`}>
                    {badge.label}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-brand-200">{skill.level}%</span>
            </div>
            
            <div className="relative">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={{ width: mounted ? `${skill.level}%` : 0 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: index * 0.2, 
                    ease: "easeOut" 
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.2 + 0.5,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Skill level indicator */}
              <motion.div
                className="absolute top-0 h-2 w-1 bg-white rounded-full shadow-lg"
                style={{ left: `${skill.level}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.2 + 1.2 
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
