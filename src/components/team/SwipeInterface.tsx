import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, X, Plus, MapPin, Clock, Github, Linkedin, ExternalLink } from 'lucide-react'
import { TeamMember } from './TeamFormation'
import SkillVisualization from './SkillVisualization'

interface SwipeInterfaceProps {
  members: TeamMember[]
  onLike: (member: TeamMember) => void
  onAddToTeam: (member: TeamMember) => void
  currentTeam: TeamMember[]
}

export default function SwipeInterface({ members, onLike, onAddToTeam, currentTeam }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const currentMember = members[currentIndex]

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    
    if (info.offset.x > threshold) {
      // Swipe right - like
      setExitDirection('right')
      onLike(currentMember)
      nextCard()
    } else if (info.offset.x < -threshold) {
      // Swipe left - pass
      setExitDirection('left')
      nextCard()
    } else {
      // Snap back
      x.set(0)
    }
  }

  const nextCard = () => {
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % members.length)
      setExitDirection(null)
      x.set(0)
    }, 300)
  }

  const handleLike = () => {
    setExitDirection('right')
    onLike(currentMember)
    nextCard()
  }

  const handlePass = () => {
    setExitDirection('left')
    nextCard()
  }

  const handleAddToTeam = () => {
    onAddToTeam(currentMember)
  }

  if (!currentMember) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">You've seen everyone!</h3>
          <p className="text-slate-400">Check back later for new team members</p>
        </div>
      </div>
    )
  }

  const isInTeam = currentTeam.some(member => member.id === currentMember.id)

  return (
    <div className="relative max-w-md mx-auto">
      {/* Card Stack */}
      <div className="relative h-[600px] perspective-1000">
        {/* Next card (background) */}
        {members[currentIndex + 1] && (
          <motion.div
            className="absolute inset-0 glassmorphism rounded-3xl p-6 transform scale-95 opacity-50"
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 0.95, opacity: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={members[currentIndex + 1].avatar}
                alt={members[currentIndex + 1].name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{members[currentIndex + 1].name}</h3>
                <p className="text-slate-300">{members[currentIndex + 1].role}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current card */}
        <motion.div
          className="swipe-card glassmorphism profile-card"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={exitDirection ? {
            x: exitDirection === 'right' ? 300 : -300,
            opacity: 0,
            scale: 0.8
          } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src={currentMember.avatar}
                  alt={currentMember.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{currentMember.name}</h3>
                <p className="text-brand-200">{currentMember.role}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentMember.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentMember.availability}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-slate-300 text-sm leading-relaxed">{currentMember.bio}</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-brand-200 mb-3">Skills</h4>
              <SkillVisualization skills={currentMember.skills} />
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-brand-200 mb-3">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {currentMember.interests.map((interest, index) => (
                  <motion.span
                    key={interest}
                    className="skill-tag px-3 py-1 bg-white/10 rounded-full text-xs text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {currentMember.github && (
                <motion.a
                  href={currentMember.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-4 h-4 text-white" />
                </motion.a>
              )}
              {currentMember.linkedin && (
                <motion.a
                  href={currentMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </motion.a>
              )}
              {currentMember.portfolio && (
                <motion.a
                  href={currentMember.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </motion.a>
              )}
            </div>

            {/* Experience */}
            <div className="mt-auto">
              <div className="text-center text-sm text-slate-400">
                {currentMember.experience} experience
              </div>
            </div>
          </div>

          {/* Swipe indicators */}
          <motion.div
            className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12"
            style={{ opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0]) }}
          >
            PASS
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold transform rotate-12"
            style={{ opacity: useTransform(x, [0, 50, 100], [0, 0.5, 1]) }}
          >
            LIKE
          </motion.div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          onClick={handlePass}
          className="w-14 h-14 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center border border-red-500/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6 text-red-400" />
        </motion.button>

        <motion.button
          onClick={handleAddToTeam}
          disabled={isInTeam || currentTeam.length >= 5}
          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-colors ${
            isInTeam || currentTeam.length >= 5
              ? 'bg-gray-500/20 border-gray-500/30 cursor-not-allowed'
              : 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30'
          }`}
          whileHover={!isInTeam && currentTeam.length < 5 ? { scale: 1.1 } : {}}
          whileTap={!isInTeam && currentTeam.length < 5 ? { scale: 0.9 } : {}}
        >
          <Plus className={`w-6 h-6 ${isInTeam || currentTeam.length >= 5 ? 'text-gray-400' : 'text-blue-400'}`} />
        </motion.button>

        <motion.button
          onClick={handleLike}
          className="w-14 h-14 bg-green-500/20 hover:bg-green-500/30 rounded-full flex items-center justify-center border border-green-500/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="w-6 h-6 text-green-400" />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6 text-sm text-slate-400">
        Swipe right to like • Swipe left to pass • Tap + to add to team
      </div>
    </div>
  )
}
