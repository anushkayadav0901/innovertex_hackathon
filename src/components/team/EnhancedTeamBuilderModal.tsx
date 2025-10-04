import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Code, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

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
  personalityTraits: {
    creativity: 'low' | 'moderate' | 'high' | null
    leadership: 'low' | 'moderate' | 'high' | null
    teamwork: 'low' | 'moderate' | 'high' | null
    organization: 'low' | 'moderate' | 'high' | null
    problemSolving: 'low' | 'moderate' | 'high' | null
    adaptability: 'low' | 'moderate' | 'high' | null
  }
}

interface EnhancedTeamBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  onFindMatches: (criteria: TeamCriteria) => void
}

interface TeamCriteria {
  personalityTraits: {
    creativity: 'low' | 'moderate' | 'high' | null
    leadership: 'low' | 'moderate' | 'high' | null
    teamwork: 'low' | 'moderate' | 'high' | null
    organization: 'low' | 'moderate' | 'high' | null
    problemSolving: 'low' | 'moderate' | 'high' | null
    adaptability: 'low' | 'moderate' | 'high' | null
  }
  techStack: {
    required: string[]
    preferred: string[]
    experience: 'junior' | 'mid' | 'senior' | 'any'
  }
  availability: 'full-time' | 'part-time' | 'any'
  location: 'remote' | 'onsite' | 'hybrid' | 'any'
}

const PERSONALITY_TRAITS = [
  { key: 'creativity', label: 'Creativity', icon: '🎨', description: 'Innovative thinking and artistic approach' },
  { key: 'leadership', label: 'Leadership', icon: '👑', description: 'Ability to guide and inspire others' },
  { key: 'teamwork', label: 'Teamwork', icon: '🤝', description: 'Collaborative and supportive nature' },
  { key: 'organization', label: 'Organization', icon: '📋', description: 'Structured and methodical approach' },
  { key: 'problemSolving', label: 'Problem Solving', icon: '🧩', description: 'Analytical and solution-oriented' },
  { key: 'adaptability', label: 'Adaptability', icon: '🔄', description: 'Flexible and quick to adjust' }
] as const

const TECH_STACK_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'TypeScript', 'JavaScript', 'HTML/CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure',
  'Docker', 'Kubernetes', 'Git', 'Figma', 'Adobe XD', 'Sketch', 'TensorFlow', 'PyTorch',
  'Machine Learning', 'AI', 'Blockchain', 'Web3', 'Mobile Development', 'iOS', 'Android'
]

export default function EnhancedTeamBuilderModal({ isOpen, onClose, onFindMatches }: EnhancedTeamBuilderModalProps) {
  const [currentStep, setCurrentStep] = useState<'personality' | 'tech' | 'preferences'>('personality')
  const [criteria, setCriteria] = useState<TeamCriteria>({
    personalityTraits: {
      creativity: null,
      leadership: null,
      teamwork: null,
      organization: null,
      problemSolving: null,
      adaptability: null
    },
    techStack: {
      required: [],
      preferred: [],
      experience: 'any'
    },
    availability: 'any',
    location: 'any'
  })

  const updatePersonalityTrait = (trait: keyof TeamCriteria['personalityTraits'], value: 'low' | 'moderate' | 'high' | null) => {
    setCriteria(prev => ({
      ...prev,
      personalityTraits: {
        ...prev.personalityTraits,
        [trait]: value
      }
    }))
  }

  const toggleTechStack = (tech: string, type: 'required' | 'preferred') => {
    setCriteria(prev => {
      const currentList = prev.techStack[type]
      const newList = currentList.includes(tech)
        ? currentList.filter(t => t !== tech)
        : [...currentList, tech]
      
      return {
        ...prev,
        techStack: {
          ...prev.techStack,
          [type]: newList
        }
      }
    })
  }

  const handleNext = () => {
    if (currentStep === 'personality') {
      setCurrentStep('tech')
    } else if (currentStep === 'tech') {
      setCurrentStep('preferences')
    }
  }

  const handleBack = () => {
    if (currentStep === 'tech') {
      setCurrentStep('personality')
    } else if (currentStep === 'preferences') {
      setCurrentStep('tech')
    }
  }

  const handleSubmit = () => {
    onFindMatches(criteria)
    onClose()
  }

  const isPersonalityComplete = Object.values(criteria.personalityTraits).some(value => value !== null)
  const isTechComplete = criteria.techStack.required.length > 0 || criteria.techStack.preferred.length > 0

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-6xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Build Your Dream Team</h2>
                <p className="text-sm text-slate-400">Find teammates who match your vision</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              {[
                { key: 'personality', label: 'Personality', icon: Sparkles },
                { key: 'tech', label: 'Tech Stack', icon: Code },
                { key: 'preferences', label: 'Preferences', icon: Star }
              ].map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.key
                const isCompleted = (step.key === 'personality' && isPersonalityComplete) ||
                                 (step.key === 'tech' && isTechComplete) ||
                                 (step.key === 'preferences')
                
                return (
                  <div key={step.key} className="flex items-center">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-500/20 text-blue-400' : 
                      isCompleted ? 'bg-green-500/20 text-green-400' : 
                      'bg-slate-800 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.label}</span>
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-px mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[65vh]">
            <AnimatePresence mode="wait">
              {currentStep === 'personality' && (
                <motion.div
                  key="personality"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Personality Traits</h3>
                    <p className="text-sm text-slate-400 mb-6">Rate the importance of each trait for your ideal teammates</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {PERSONALITY_TRAITS.map(trait => (
                      <div key={trait.key} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{trait.icon}</span>
                          <div>
                            <h4 className="font-medium text-white">{trait.label}</h4>
                            <p className="text-xs text-slate-400">{trait.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {[
                            { value: null, label: 'N/A' },
                            { value: 'low', label: 'Low' },
                            { value: 'moderate', label: 'Moderate' },
                            { value: 'high', label: 'High' }
                          ].map(option => (
                            <button
                              key={option.value || 'na'}
                              onClick={() => updatePersonalityTrait(trait.key as keyof TeamCriteria['personalityTraits'], option.value)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                criteria.personalityTraits[trait.key as keyof TeamCriteria['personalityTraits']] === option.value
                                  ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/25'
                                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Announcements and FAQs Section */}
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Announcements
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          Kickoff at 10:00 AM IST
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          Team formation closes at 2:00 PM
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          Submission deadline: Oct 17, 6:00 PM IST
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        FAQs
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          Team size: 1-4 members
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          Submission: GitHub link and slide deck
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          Judging: Innovation, Technical Depth, Impact, Presentation
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'tech' && (
                <motion.div
                  key="tech"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Tech Stack Requirements</h3>
                    <p className="text-sm text-slate-400 mb-6">Select technologies your teammates should know</p>
                  </div>

                  {/* Required Skills */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {TECH_STACK_OPTIONS.map(tech => (
                        <button
                          key={tech}
                          onClick={() => toggleTechStack(tech, 'required')}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            criteria.techStack.required.includes(tech)
                              ? 'bg-red-500/20 border-red-400 text-red-400'
                              : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Preferred Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {TECH_STACK_OPTIONS.map(tech => (
                        <button
                          key={tech}
                          onClick={() => toggleTechStack(tech, 'preferred')}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            criteria.techStack.preferred.includes(tech)
                              ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400'
                              : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Experience Level</h4>
                    <div className="flex gap-2">
                      {[
                        { value: 'any', label: 'Any Level' },
                        { value: 'junior', label: 'Junior (0-2 years)' },
                        { value: 'mid', label: 'Mid (2-5 years)' },
                        { value: 'senior', label: 'Senior (5+ years)' }
                      ].map(level => (
                        <button
                          key={level.value}
                          onClick={() => setCriteria(prev => ({
                            ...prev,
                            techStack: { ...prev.techStack, experience: level.value as any }
                          }))}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            criteria.techStack.experience === level.value
                              ? 'bg-blue-500 border-blue-400 text-white'
                              : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Additional Preferences</h3>
                    <p className="text-sm text-slate-400 mb-6">Set your team formation preferences</p>
                  </div>

                  {/* Availability */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Availability</h4>
                    <div className="flex gap-2">
                      {[
                        { value: 'any', label: 'Any' },
                        { value: 'full-time', label: 'Full-time' },
                        { value: 'part-time', label: 'Part-time' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setCriteria(prev => ({ ...prev, availability: option.value as any }))}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            criteria.availability === option.value
                              ? 'bg-blue-500 border-blue-400 text-white'
                              : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Location Preference</h4>
                    <div className="flex gap-2">
                      {[
                        { value: 'any', label: 'Any' },
                        { value: 'remote', label: 'Remote' },
                        { value: 'onsite', label: 'On-site' },
                        { value: 'hybrid', label: 'Hybrid' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setCriteria(prev => ({ ...prev, location: option.value as any }))}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            criteria.location === option.value
                              ? 'bg-blue-500 border-blue-400 text-white'
                              : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 'personality'}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            <div className="flex items-center gap-3">
              {currentStep === 'preferences' ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Find Matches
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={(currentStep === 'personality' && !isPersonalityComplete) || 
                           (currentStep === 'tech' && !isTechComplete)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
