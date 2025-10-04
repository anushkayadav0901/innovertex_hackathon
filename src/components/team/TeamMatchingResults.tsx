import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Clock, Github, Linkedin, ExternalLink, Users, Code, MessageCircle, CheckCircle, X } from 'lucide-react'
import { TeamMember, TeamCriteria } from './EnhancedTeamBuilderModal'

interface TeamMatchingResultsProps {
  criteria: TeamCriteria
  matches: TeamMember[]
  onClose: () => void
  onInviteMember: (member: TeamMember) => void
}

export default function TeamMatchingResults({ criteria, matches, onClose, onInviteMember }: TeamMatchingResultsProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [sortBy, setSortBy] = useState<'compatibility' | 'skills' | 'experience'>('compatibility')

  // Calculate compatibility score
  const calculateCompatibility = (member: TeamMember): number => {
    let score = 0
    let totalWeight = 0

    // Personality traits matching
    Object.entries(criteria.personalityTraits).forEach(([trait, importance]) => {
      if (importance !== null) {
        const memberTrait = member.personalityTraits[trait as keyof typeof member.personalityTraits]
        
        // Convert categorical values to numerical scores for calculation
        const importanceScore = importance === 'high' ? 3 : importance === 'moderate' ? 2 : 1
        const memberScore = memberTrait === 'high' ? 3 : memberTrait === 'moderate' ? 2 : memberTrait === 'low' ? 1 : 0
        
        // Calculate trait compatibility (higher score for better matches)
        const traitScore = memberTrait === null ? 0 : Math.max(0, 3 - Math.abs(importanceScore - memberScore))
        score += traitScore * importanceScore
        totalWeight += importanceScore
      }
    })

    // Tech stack matching
    const requiredSkills = criteria.techStack.required
    const preferredSkills = criteria.techStack.preferred
    const memberSkills = member.skills.map(s => s.name.toLowerCase())

    requiredSkills.forEach(skill => {
      if (memberSkills.includes(skill.toLowerCase())) {
        score += 10 // High weight for required skills
        totalWeight += 10
      }
    })

    preferredSkills.forEach(skill => {
      if (memberSkills.includes(skill.toLowerCase())) {
        score += 5 // Medium weight for preferred skills
        totalWeight += 5
      }
    })

    // Experience level matching
    const experienceMap = { junior: 1, mid: 2, senior: 3, any: 0 }
    const memberExperience = member.experience.includes('5+') ? 3 : 
                           member.experience.includes('2-5') ? 2 : 1
    const requiredExperience = experienceMap[criteria.techStack.experience]
    
    if (requiredExperience === 0 || memberExperience >= requiredExperience) {
      score += 5
      totalWeight += 5
    }

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0
  }

  // Sort matches based on selected criteria
  const sortedMatches = [...matches].sort((a, b) => {
    switch (sortBy) {
      case 'compatibility':
        return calculateCompatibility(b) - calculateCompatibility(a)
      case 'skills':
        return b.skills.length - a.skills.length
      case 'experience':
        const getExperienceLevel = (exp: string) => {
          if (exp.includes('5+')) return 3
          if (exp.includes('2-5')) return 2
          return 1
        }
        return getExperienceLevel(b.experience) - getExperienceLevel(a.experience)
      default:
        return 0
    }
  })

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20'
    if (score >= 40) return 'text-orange-400 bg-orange-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const getSkillLevelColor = (level: number) => {
    if (level >= 80) return 'bg-green-500'
    if (level >= 60) return 'bg-blue-500'
    if (level >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-24">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-[95vw] max-h-[85vh] overflow-hidden"
        >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Team Matching Results</h2>
              <p className="text-sm text-slate-400">Found {matches.length} potential teammates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="compatibility">Sort by Compatibility</option>
              <option value="skills">Sort by Skills</option>
              <option value="experience">Sort by Experience</option>
            </select>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {sortedMatches.map((member, index) => {
                const compatibility = calculateCompatibility(member)
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
                    onClick={() => setSelectedMember(member)}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{member.name}</h3>
                        <p className="text-sm text-slate-400 truncate">{member.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">{member.location}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getCompatibilityColor(compatibility)}`}>
                        {compatibility}%
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">{member.bio}</p>

                    {/* Skills */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Code className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map(skill => (
                          <span
                            key={skill.name}
                            className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="px-2 py-1 bg-slate-700 text-xs text-slate-500 rounded">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Experience & Availability */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{member.experience}</span>
                      </div>
                      <span className="px-2 py-1 bg-slate-700 rounded text-slate-300">
                        {member.availability}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onInviteMember(member)
                      }}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium"
                    >
                      Invite to Team
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {matches.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No matches found</h3>
              <p className="text-slate-400">Try adjusting your criteria to find more teammates</p>
            </div>
          )}
        </div>

        {/* Member Detail Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedMember.name}</h2>
                      <p className="text-slate-400">{selectedMember.role}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{selectedMember.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{selectedMember.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="font-semibold text-white mb-2">About</h3>
                    <p className="text-slate-300">{selectedMember.bio}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Skills & Expertise</h3>
                    <div className="space-y-3">
                      {selectedMember.skills.map(skill => (
                        <div key={skill.name} className="flex items-center justify-between">
                          <span className="text-slate-300">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getSkillLevelColor(skill.level)}`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400 w-8">{skill.level}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.interests.map(interest => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Personality Traits */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Personality Traits</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedMember.personalityTraits).map(([trait, value]) => (
                        <div key={trait} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <span className="text-slate-300 capitalize">{trait.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              value === 'high' ? 'bg-green-500/20 text-green-400' :
                              value === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                              value === 'low' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {value === null ? 'N/A' : value.charAt(0).toUpperCase() + value.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Links</h3>
                    <div className="flex gap-3">
                      {selectedMember.github && (
                        <a
                          href={selectedMember.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Github className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">GitHub</span>
                        </a>
                      )}
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">LinkedIn</span>
                        </a>
                      )}
                      {selectedMember.portfolio && (
                        <a
                          href={selectedMember.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">Portfolio</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onInviteMember(selectedMember)
                        setSelectedMember(null)
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Invite to Team
                    </button>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
