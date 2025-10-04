import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, X, Plus, MapPin, Clock, Github, Linkedin, ExternalLink } from 'lucide-react'
import { TeamMember } from './TeamFormation'
import SkillVisualization from './SkillVisualization'

interface SwipeInterfaceProps {
  members: TeamMember[]
  onLike: (member: TeamMember) => void
  onAddToTeam: (member: TeamMember) => void
  currentTeam: TeamMember[]
  showForm?: boolean
  onToggleForm?: () => void
}

export default function SwipeInterface({ members, onLike, onAddToTeam, currentTeam, showForm: showFormProp, onToggleForm }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  // Personality form state (inline, simple, persistent)
  type Trait = 'creativity' | 'leadership' | 'teamwork' | 'organization' | 'problemSolving' | 'adaptability'
  const TRAITS: Trait[] = ['creativity','leadership','teamwork','organization','problemSolving','adaptability']
  const TRAIT_LABELS: Record<Trait,string> = {
    creativity: 'Creativity',
    leadership: 'Leadership',
    teamwork: 'Teamwork',
    organization: 'Organization',
    problemSolving: 'Problem Solving',
    adaptability: 'Adaptability',
  }

  // Prevent drag from stealing clicks inside the card (buttons, form controls)
  const stopDrag = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation()
  }
  const ALL_SKILLS = ['AI/ML','IoT','Web','Mobile','Cloud','Blockchain','AR/VR','Data Science','DevOps','Product','UI/UX']
  const [answers, setAnswers] = useState<Record<Trait, number>>({
    creativity: 3,
    leadership: 3,
    teamwork: 3,
    organization: 3,
    problemSolving: 3,
    adaptability: 3,
  })
  const [mySkills, setMySkills] = useState<string[]>([])
  
  useEffect(() => {
    try {
      const a = localStorage.getItem('inline:personality:answers')
      if (a) setAnswers(JSON.parse(a))
      const s = localStorage.getItem('inline:personality:skills')
      if (s) setMySkills(JSON.parse(s))
    } catch {}
  }, [])
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
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

  const toggleSkill = (s: string) => {
    setMySkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const saveForm = () => {
    try {
      localStorage.setItem('inline:personality:answers', JSON.stringify(answers))
      localStorage.setItem('inline:personality:skills', JSON.stringify(mySkills))
    } catch {}
    setShowForm(false)
  }

  const isInTeam = currentTeam.some(member => member.id === currentMember.id)
  const isFormOpen = (showFormProp !== undefined) ? !!showFormProp : showForm

  // Extra actions: Invite via link / Build team preferences
  const [showInvite, setShowInvite] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [showBuild, setShowBuild] = useState(false)
  const [desiredTraits, setDesiredTraits] = useState<Record<Trait, number>>({
    creativity: 3, leadership: 3, teamwork: 3, organization: 3, problemSolving: 3, adaptability: 3,
  })
  const [requiredStack, setRequiredStack] = useState('')

  const handleSendInvite = () => {
    // Simple mailto compose as a placeholder
    const subject = encodeURIComponent('Join my team on Innovortex')
    const body = encodeURIComponent(`Hi ${inviteName || ''},\n\nI would love to invite you to join my team. Here is the link to join: ${window.location.origin}/team/invite\n\nThanks!`)
    if (inviteEmail) {
      window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`
    }
  }

  const handleSaveBuildCriteria = () => {
    try {
      localStorage.setItem('build:desiredTraits', JSON.stringify(desiredTraits))
      localStorage.setItem('build:requiredStack', requiredStack)
    } catch {}
    setShowBuild(false)
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Card Stack */}
      <div className="relative h-[820px] perspective-1000">
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
          <div className="p-6 h-full flex flex-col overflow-y-auto">
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
              <button
                onPointerDown={stopDrag}
                onMouseDown={stopDrag}
                onClick={() => setShowForm(v => !v)}
                className="px-3 py-2 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15"
              >
                {showForm ? 'Close' : 'Edit Personality & Skills'}
              </button>
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

            {/* Personality Traits */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-brand-200 mb-3">Personality Traits</h4>
              <div className="space-y-3">
                {TRAITS.map(trait => {
                  const value = answers[trait] ?? 0
                  const pct = Math.max(0, Math.min(100, value * 20))
                  const label = TRAIT_LABELS[trait]
                  const barColor = value >= 4 ? 'bg-emerald-500' : value === 3 ? 'bg-blue-500' : 'bg-purple-500'
                  return (
                    <div key={trait} className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-200 text-sm">{label}</span>
                        <span className="text-slate-400 text-xs">{pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Inline Personality & Skills Form (static, no scaling) */}
            {showForm && (
              <div
                className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4"
                onPointerDown={stopDrag}
                onMouseDown={stopDrag}
              >
                <h4 className="text-sm font-semibold text-brand-200 mb-3">Personality Questionnaire</h4>
                <div className="space-y-4">
                  {TRAITS.map(trait => (
                    <div key={trait} className="flex items-center gap-3">
                      <div className="w-44 text-slate-200 text-sm">{TRAIT_LABELS[trait]}</div>
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map(v => (
                          <label
                            key={v}
                            onPointerDown={stopDrag}
                            onMouseDown={stopDrag}
                            className={`w-9 h-9 rounded-md text-sm border flex items-center justify-center cursor-pointer select-none ${answers[trait]===v ? 'bg-brand-500 text-white border-brand-400' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                          >
                            <input type="radio" name={trait} value={v} className="hidden" onChange={() => setAnswers(a => ({...a,[trait]: v}))} />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions: Invite via link / Build Team */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <button
                    onPointerDown={stopDrag}
                    onMouseDown={stopDrag}
                    onClick={() => { setShowInvite(v=>!v); setShowBuild(false) }}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs border border-white/15"
                  >
                    Invite via link
                  </button>
                  <button
                    onPointerDown={stopDrag}
                    onMouseDown={stopDrag}
                    onClick={() => { setShowBuild(v=>!v); setShowInvite(false) }}
                    className="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 text-xs border border-blue-400/30"
                  >
                    Build Team
                  </button>
                </div>

                {showInvite && (
                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    <input
                      onPointerDown={stopDrag}
                      onMouseDown={stopDrag}
                      value={inviteName}
                      onChange={e=>setInviteName(e.target.value)}
                      className="col-span-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                      placeholder="Invitee Name"
                      type="text"
                    />
                    <input
                      onPointerDown={stopDrag}
                      onMouseDown={stopDrag}
                      value={inviteEmail}
                      onChange={e=>setInviteEmail(e.target.value)}
                      className="col-span-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                      placeholder="Invitee Email"
                      type="email"
                    />
                    <button
                      onPointerDown={stopDrag}
                      onMouseDown={stopDrag}
                      onClick={handleSendInvite}
                      className="col-span-1 px-3 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm"
                    >
                      Send Invite
                    </button>
                  </div>
                )}

                {showBuild && (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-3">
                      {TRAITS.map(trait => (
                        <div key={trait} className="flex items-center gap-3">
                          <div className="w-44 text-slate-200 text-xs">Desired {TRAIT_LABELS[trait]}</div>
                          <div className="flex items-center gap-2">
                            {[1,2,3,4,5].map(v => (
                              <label key={v} className={`w-8 h-8 rounded-md text-xs border flex items-center justify-center cursor-pointer select-none ${desiredTraits[trait]===v ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}>
                                <input type="radio" name={`desired-${trait}`} value={v} className="hidden" onChange={() => setDesiredTraits(a => ({...a,[trait]: v}))} />
                                {v}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Required Tech Stack (comma-separated)</label>
                      <input
                        onPointerDown={stopDrag}
                        onMouseDown={stopDrag}
                        value={requiredStack}
                        onChange={e=>setRequiredStack(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                        placeholder="e.g., React, Node.js, Python, AWS"
                        type="text"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onPointerDown={stopDrag} onMouseDown={stopDrag} onClick={()=>setShowBuild(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm">Cancel</button>
                      <button onPointerDown={stopDrag} onMouseDown={stopDrag} onClick={handleSaveBuildCriteria} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm">Save Criteria</button>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <h5 className="text-sm font-semibold text-brand-200 mb-2">Your Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map(s => (
                      <button
                        key={s}
                        onPointerDown={stopDrag}
                        onMouseDown={stopDrag}
                        onClick={() => toggleSkill(s)}
                        className={`px-3 py-1 rounded-full text-xs border ${mySkills.includes(s) ? 'bg-brand-500/30 border-brand-500 text-brand-100' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onPointerDown={stopDrag} onMouseDown={stopDrag} onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm">Cancel</button>
                  <button onPointerDown={stopDrag} onMouseDown={stopDrag} onClick={saveForm} className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm">Save</button>
                </div>
              </div>
            )}

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
