import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, Zap, Award } from 'lucide-react'
import { TeamMember } from './TeamFormation'

interface CompatibilityMeterProps {
  team: TeamMember[]
}

interface CompatibilityMetric {
  name: string
  score: number
  icon: React.ComponentType<any>
  description: string
  color: string
}

export default function CompatibilityMeter({ team }: CompatibilityMeterProps) {
  const [mounted, setMounted] = useState(false)
  const [animatedScores, setAnimatedScores] = useState<number[]>([0, 0, 0, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate compatibility metrics
  const calculateCompatibility = (): CompatibilityMetric[] => {
    if (team.length < 2) return []

    // Skill diversity score
    const allSkills = team.flatMap(member => member.skills.map(skill => skill.name))
    const uniqueSkills = new Set(allSkills)
    const skillDiversityScore = Math.min((uniqueSkills.size / 10) * 100, 100)

    // Role balance score
    const roles = team.map(member => member.role.toLowerCase())
    const uniqueRoles = new Set(roles)
    const roleBalanceScore = Math.min((uniqueRoles.size / team.length) * 100, 100)

    // Experience alignment score
    const experienceYears = team.map(member => {
      const exp = member.experience.match(/\d+/)
      return exp ? parseInt(exp[0]) : 0
    })
    const avgExperience = experienceYears.reduce((a, b) => a + b, 0) / experienceYears.length
    const experienceVariance = experienceYears.reduce((acc, exp) => acc + Math.pow(exp - avgExperience, 2), 0) / experienceYears.length
    const experienceAlignmentScore = Math.max(100 - (experienceVariance * 10), 60)

    // Interest overlap score
    const allInterests = team.flatMap(member => member.interests)
    const interestCounts = allInterests.reduce((acc, interest) => {
      acc[interest] = (acc[interest] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const sharedInterests = Object.values(interestCounts).filter(count => count > 1).length
    const interestOverlapScore = Math.min((sharedInterests / 3) * 100, 100)

    return [
      {
        name: 'Skill Diversity',
        score: Math.round(skillDiversityScore),
        icon: Target,
        description: 'Variety of technical skills across the team',
        color: 'from-blue-400 to-blue-600'
      },
      {
        name: 'Role Balance',
        score: Math.round(roleBalanceScore),
        icon: Users,
        description: 'Distribution of different roles and responsibilities',
        color: 'from-green-400 to-green-600'
      },
      {
        name: 'Experience Sync',
        score: Math.round(experienceAlignmentScore),
        icon: TrendingUp,
        description: 'Alignment of experience levels for effective collaboration',
        color: 'from-purple-400 to-purple-600'
      },
      {
        name: 'Interest Overlap',
        score: Math.round(interestOverlapScore),
        icon: Zap,
        description: 'Shared interests and passion areas',
        color: 'from-orange-400 to-orange-600'
      }
    ]
  }

  const metrics = calculateCompatibility()
  const overallScore = metrics.length > 0 ? Math.round(metrics.reduce((acc, metric) => acc + metric.score, 0) / metrics.length) : 0

  // Animate scores when mounted
  useEffect(() => {
    if (mounted && metrics.length > 0) {
      const timers = metrics.map((metric, index) => 
        setTimeout(() => {
          setAnimatedScores(prev => {
            const newScores = [...prev]
            newScores[index] = metric.score
            return newScores
          })
        }, index * 200)
      )

      return () => timers.forEach(clearTimeout)
    }
  }, [mounted, metrics.length])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Work'
  }

  if (team.length < 2) {
    return (
      <div className="glassmorphism rounded-2xl p-6 text-center">
        <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Team Compatibility</h3>
        <p className="text-slate-400">Add at least 2 members to see compatibility analysis</p>
      </div>
    )
  }

  return (
    <motion.div
      className="glassmorphism rounded-2xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-brand-400" />
          Team Compatibility
        </h3>
        <p className="text-slate-300">Analysis of how well your team works together</p>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <motion.div
            className="compatibility-meter w-32 h-32 rounded-full border-8 border-white/10 flex items-center justify-center relative overflow-hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, #3b5cff 0deg, #8b5cf6 ${overallScore * 3.6}deg, rgba(255,255,255,0.1) ${overallScore * 3.6}deg)`
              }}
              initial={{ rotate: -90 }}
              animate={{ rotate: -90 }}
            />
            
            <div className="relative z-10 text-center">
              <motion.div
                className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {overallScore}%
              </motion.div>
              <div className="text-xs text-slate-400">{getScoreLabel(overallScore)}</div>
            </div>
          </motion.div>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-brand-400"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.name}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{metric.name}</h4>
                  <p className="text-xs text-slate-400">{metric.description}</p>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(animatedScores[index])}`}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    {Math.round(animatedScores[index])}%
                  </motion.span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${metric.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedScores[index]}%` }}
                  transition={{ 
                    duration: 1, 
                    delay: index * 0.2,
                    ease: "easeOut" 
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendations */}
      {overallScore < 70 && (
        <motion.div
          className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <h4 className="font-semibold text-yellow-400">Recommendations</h4>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            {overallScore < 50 && (
              <li>• Consider adding members with complementary skills</li>
            )}
            {(metrics.find(m => m.name === 'Role Balance')?.score ?? 0) < 60 && (
              <li>• Try to balance different roles (frontend, backend, design, etc.)</li>
            )}
            {(metrics.find(m => m.name === 'Interest Overlap')?.score ?? 0) < 40 && (
              <li>• Look for members with shared interests or project goals</li>
            )}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}
