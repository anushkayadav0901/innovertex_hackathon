import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Users, Plus, X, Crown, Star } from 'lucide-react'
import { TeamMember } from './TeamFormation'
import SkillVisualization from './SkillVisualization'

interface TeamBuilderProps {
  currentTeam: TeamMember[]
  likedMembers: TeamMember[]
  onAddToTeam: (member: TeamMember) => void
  onRemoveFromTeam: (memberId: string) => void
}

export default function TeamBuilder({ currentTeam, likedMembers, onAddToTeam, onRemoveFromTeam }: TeamBuilderProps) {
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  const availableMembers = likedMembers.filter(
    member => !currentTeam.find(teamMember => teamMember.id === member.id)
  )

  const handleDragEnd = (result: DropResult) => {
    setDraggedOver(null)
    
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // Moving from available to team
    if (source.droppableId === 'available' && destination.droppableId === 'team') {
      const member = availableMembers.find(m => m.id === draggableId)
      if (member && currentTeam.length < 5) {
        onAddToTeam(member)
      }
    }
    
    // Moving from team to available (remove)
    if (source.droppableId === 'team' && destination.droppableId === 'available') {
      onRemoveFromTeam(draggableId)
    }
  }

  const handleDragUpdate = (update: any) => {
    setDraggedOver(update.destination?.droppableId || null)
  }

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('lead') || role.toLowerCase().includes('manager')) {
      return <Crown className="w-4 h-4 text-yellow-400" />
    }
    return <Star className="w-4 h-4 text-brand-400" />
  }

  return (
    <div className="space-y-8">
      {/* Team Overview */}
      <div className="glassmorphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-400" />
            Your Team ({currentTeam.length}/5)
          </h2>
          <div className="text-sm text-slate-400">
            Drag members between sections to build your team
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
          {/* Current Team */}
          <Droppable droppableId="team" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`drop-zone min-h-[200px] rounded-xl p-4 mb-8 transition-all ${
                  snapshot.isDraggingOver || draggedOver === 'team'
                    ? 'active bg-brand-500/10 border-brand-400'
                    : 'bg-white/5 border-white/10'
                } border-2 border-dashed`}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </h3>
                
                {currentTeam.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-slate-400">
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Drag team members here</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentTeam.map((member, index) => (
                      <Draggable key={member.id} draggableId={member.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`glassmorphism rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all ${
                              snapshot.isDragging ? 'shadow-2xl scale-105 rotate-2' : ''
                            }`}
                            whileHover={{ y: -2 }}
                            layout
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-white truncate">{member.name}</h4>
                                  {getRoleIcon(member.role)}
                                </div>
                                <p className="text-sm text-slate-300 truncate">{member.role}</p>
                              </div>
                              <button
                                onClick={() => onRemoveFromTeam(member.id)}
                                className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                              >
                                <X className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                            
                            <SkillVisualization 
                              skills={member.skills.slice(0, 2)} 
                              compact 
                              showLabels={false}
                            />
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Available Members */}
          <Droppable droppableId="available" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`drop-zone min-h-[200px] rounded-xl p-4 transition-all ${
                  snapshot.isDraggingOver || draggedOver === 'available'
                    ? 'active bg-purple-500/10 border-purple-400'
                    : 'bg-white/5 border-white/10'
                } border-2 border-dashed`}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Available Members ({availableMembers.length})
                </h3>
                
                {availableMembers.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-slate-400">
                    <div className="text-center">
                      <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No available members</p>
                      <p className="text-sm">Go to Discover to find teammates</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {availableMembers.map((member, index) => (
                      <Draggable key={member.id} draggableId={member.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`glassmorphism rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all ${
                              snapshot.isDragging ? 'shadow-2xl scale-105 rotate-2' : ''
                            }`}
                            whileHover={{ y: -2 }}
                            layout
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white text-sm truncate">{member.name}</h4>
                                <p className="text-xs text-slate-300 truncate">{member.role}</p>
                              </div>
                              <button
                                onClick={() => onAddToTeam(member)}
                                disabled={currentTeam.length >= 5}
                                className={`p-1 rounded-full transition-colors ${
                                  currentTeam.length >= 5
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:bg-green-500/20'
                                }`}
                              >
                                <Plus className="w-4 h-4 text-green-400" />
                              </button>
                            </div>
                            
                            <div className="space-y-1">
                              {member.skills.slice(0, 2).map(skill => (
                                <div key={skill.name} className="flex items-center justify-between">
                                  <span className="text-xs text-slate-300">{skill.name}</span>
                                  <span className="text-xs text-brand-200">{skill.level}%</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Team Stats */}
      {currentTeam.length > 0 && (
        <motion.div
          className="glassmorphism rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Team Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Roles Distribution */}
            <div>
              <h4 className="text-sm font-semibold text-brand-200 mb-3">Roles</h4>
              <div className="space-y-2">
                {currentTeam.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-white">{member.name}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-300">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Coverage */}
            <div>
              <h4 className="text-sm font-semibold text-brand-200 mb-3">Skill Coverage</h4>
              <div className="space-y-2">
                {Array.from(new Set(currentTeam.flatMap(member => member.skills.map(skill => skill.name))))
                  .slice(0, 5)
                  .map(skillName => {
                    const avgLevel = Math.round(
                      currentTeam
                        .flatMap(member => member.skills)
                        .filter(skill => skill.name === skillName)
                        .reduce((acc, skill, _, arr) => acc + skill.level / arr.length, 0)
                    )
                    return (
                      <div key={skillName} className="flex items-center justify-between">
                        <span className="text-sm text-white">{skillName}</span>
                        <span className="text-sm text-brand-200">{avgLevel}%</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
