import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MessageCircle, Target, Zap } from 'lucide-react'
import SwipeInterface from './SwipeInterface'
import TeamBuilder from './TeamBuilder'
import CompatibilityMeter from './CompatibilityMeter'
import TeamChat from './TeamChat'

export interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  skills: { name: string; level: number }[]
  bio: string
  experience: string
  location: string
  availability: string
  interests: string[]
  github?: string
  linkedin?: string
  portfolio?: string
}

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Full Stack Developer',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'Python', level: 75 }
    ],
    bio: 'Passionate developer with 5+ years experience building scalable web applications.',
    experience: '5+ years',
    location: 'San Francisco, CA',
    availability: 'Full-time',
    interests: ['AI/ML', 'Web3', 'Mobile Development'],
    github: 'https://github.com/alexchen',
    portfolio: 'https://alexchen.dev'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'UI/UX Designer',
    skills: [
      { name: 'Figma', level: 95 },
      { name: 'Adobe XD', level: 88 },
      { name: 'Prototyping', level: 92 },
      { name: 'User Research', level: 85 }
    ],
    bio: 'Creative designer focused on user-centered design and innovative digital experiences.',
    experience: '4+ years',
    location: 'New York, NY',
    availability: 'Part-time',
    interests: ['Design Systems', 'Accessibility', 'AR/VR'],
    linkedin: 'https://linkedin.com/in/sarahjohnson'
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'Data Scientist',
    skills: [
      { name: 'Python', level: 93 },
      { name: 'Machine Learning', level: 88 },
      { name: 'TensorFlow', level: 82 },
      { name: 'SQL', level: 90 }
    ],
    bio: 'Data scientist specializing in ML algorithms and predictive analytics.',
    experience: '6+ years',
    location: 'Austin, TX',
    availability: 'Full-time',
    interests: ['AI/ML', 'Healthcare Tech', 'Climate Tech'],
    github: 'https://github.com/marcusr'
  },
  {
    id: '4',
    name: 'Emily Zhang',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'Product Manager',
    skills: [
      { name: 'Product Strategy', level: 92 },
      { name: 'Agile/Scrum', level: 88 },
      { name: 'Analytics', level: 85 },
      { name: 'User Research', level: 80 }
    ],
    bio: 'Product manager with expertise in bringing innovative ideas to market.',
    experience: '7+ years',
    location: 'Seattle, WA',
    availability: 'Full-time',
    interests: ['Fintech', 'EdTech', 'Sustainability'],
    linkedin: 'https://linkedin.com/in/emilyzhang'
  }
]

export default function TeamFormation() {
  const [activeTab, setActiveTab] = useState<'discover' | 'build' | 'chat'>('discover')
  const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([])
  const [likedMembers, setLikedMembers] = useState<TeamMember[]>([])

  const handleMemberLike = (member: TeamMember) => {
    setLikedMembers(prev => [...prev, member])
  }

  const handleAddToTeam = (member: TeamMember) => {
    if (currentTeam.length < 5 && !currentTeam.find(m => m.id === member.id)) {
      setCurrentTeam(prev => [...prev, member])
    }
  }

  const handleRemoveFromTeam = (memberId: string) => {
    setCurrentTeam(prev => prev.filter(m => m.id !== memberId))
  }

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Zap },
    { id: 'build', label: 'Build Team', icon: Users },
    { id: 'chat', label: 'Team Chat', icon: MessageCircle }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Team Formation
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover amazing teammates, build your dream team, and collaborate seamlessly
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glassmorphism rounded-2xl p-2 flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl"
                      layoutId="activeTabBg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-400">{currentTeam.length}</div>
            <div className="text-sm text-slate-300">Team Members</div>
          </div>
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{likedMembers.length}</div>
            <div className="text-sm text-slate-300">Liked Profiles</div>
          </div>
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">
              {currentTeam.length > 0 ? Math.round(currentTeam.reduce((acc, member) => 
                acc + member.skills.reduce((skillAcc, skill) => skillAcc + skill.level, 0) / member.skills.length, 0
              ) / currentTeam.length) : 0}%
            </div>
            <div className="text-sm text-slate-300">Avg Skill Level</div>
          </div>
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {currentTeam.length >= 2 ? Math.round(Math.random() * 30 + 70) : 0}%
            </div>
            <div className="text-sm text-slate-300">Compatibility</div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'discover' && (
              <SwipeInterface
                members={mockMembers}
                onLike={handleMemberLike}
                onAddToTeam={handleAddToTeam}
                currentTeam={currentTeam}
              />
            )}
            
            {activeTab === 'build' && (
              <div className="space-y-6">
                <TeamBuilder
                  currentTeam={currentTeam}
                  likedMembers={likedMembers}
                  onAddToTeam={handleAddToTeam}
                  onRemoveFromTeam={handleRemoveFromTeam}
                />
                {currentTeam.length >= 2 && (
                  <CompatibilityMeter team={currentTeam} />
                )}
              </div>
            )}
            
            {activeTab === 'chat' && (
              <TeamChat team={currentTeam} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
