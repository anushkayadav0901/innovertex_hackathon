import React, { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { MessageCircle, Users, Award, Star, ExternalLink, Send, Eye, EyeOff } from 'lucide-react'

export default function JudgeDashboard() {
  const { hackathonId } = useParams()
  const currentUserId = useStore(s => s.session.currentUserId)
  const users = useStore(s => s.users)
  const allSubs = Object.values(useStore(s => s.submissions))
  const hackathons = useStore(s => s.hackathons)
  const teams = useStore(s => s.teams)
  const evaluations = Object.values(useStore(s => s.evaluations))
  const judgeChats = Object.values(useStore(s => s.judgeChats))
  const teamFeedbacks = Object.values(useStore(s => s.teamFeedbacks))
  const sendJudgeMessage = useStore(s => s.sendJudgeMessage)
  const addTeamFeedback = useStore(s => s.addTeamFeedback)
  
  const [activeTab, setActiveTab] = useState('submissions')
  const [chatMessage, setChatMessage] = useState('')
  const [selectedJudge, setSelectedJudge] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isPublicFeedback, setIsPublicFeedback] = useState(true)

  // Get all judges for the current hackathon
  const judges = useMemo(() => {
    return Object.values(users).filter(user => user.role === 'judge')
  }, [users])

  // Get current hackathon from route
  const currentHackathon = hackathonId ? hackathons[hackathonId] : undefined

  // Filter submissions for current hackathon
  const subs = useMemo(() => {
    if (!currentHackathon) return []
    return allSubs.filter(su => su.hackathonId === currentHackathon.id)
  }, [allSubs, currentHackathon])

  // Get judge chats for current hackathon
  const hackathonChats = useMemo(() => {
    if (!currentHackathon) return []
    return judgeChats
      .filter(chat => chat.hackathonId === currentHackathon.id)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [judgeChats, currentHackathon])

  // Calculate overall scores for each submission
  const submissionScores = useMemo(() => {
    const scores: Record<string, { total: number; count: number; judges: string[] }> = {}
    
    evaluations.forEach(evaluation => {
      if (!scores[evaluation.submissionId]) {
        scores[evaluation.submissionId] = { total: 0, count: 0, judges: [] }
      }
      const totalScore = evaluation.scores.reduce((sum, score) => sum + score.score, 0)
      scores[evaluation.submissionId].total += totalScore
      scores[evaluation.submissionId].count += 1
      scores[evaluation.submissionId].judges.push(users[evaluation.judgeId]?.name || 'Unknown')
    })
    
    return scores
  }, [evaluations, users])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || !currentHackathon) return
    
    sendJudgeMessage(currentHackathon.id, chatMessage, selectedJudge || undefined)
    setChatMessage('')
  }

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackText.trim() || !selectedTeam || !currentHackathon) return
    
    addTeamFeedback(currentHackathon.id, selectedTeam, feedbackText, isPublicFeedback)
    setFeedbackText('')
    setSelectedTeam(null)
  }

  const tabs = [
    { id: 'submissions', label: 'Submissions', icon: Award },
    { id: 'scores', label: 'Overall Scores', icon: Star },
    { id: 'judges', label: 'Fellow Judges', icon: Users },
    { id: 'chat', label: 'Judge Chat', icon: MessageCircle },
    { id: 'feedback', label: 'Team Feedback', icon: Send },
  ]

  return (
    <div className="space-y-6">
      {!currentHackathon && (
        <div className="card p-6">
          <h1 className="text-xl font-semibold mb-2">Hackathon not found</h1>
          <Link to="/dashboard" className="btn-primary">Back to Judge Hub</Link>
        </div>
      )}
      {currentHackathon && (<>
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-2">Judge Dashboard</h1>
            <p className="text-slate-300">Welcome back! Here's your judging overview for {currentHackathon.title}</p>
          </div>
          <Link to="/dashboard" className="btn-primary bg-white/10 hover:bg-white/20">Back to Judge Hub</Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card p-1">
        <div className="flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Submissions to Review</h2>
          <div className="space-y-3">
            {subs.map(su => {
              const team = teams[su.teamId]
              const hackathon = hackathons[su.hackathonId]
              const myEvaluation = evaluations.find(e => e.submissionId === su.id && e.judgeId === currentUserId)
              
              return (
                <div key={su.id} className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{su.title}</div>
                    <div className="text-sm text-slate-300 mb-1">{hackathon?.title}</div>
                    <div className="text-sm text-blue-400">Team: {team?.name}</div>
                    {myEvaluation && (
                      <div className="text-sm text-green-400 mt-1">✓ Evaluated</div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/evaluate/${su.id}`} 
                      className={`btn-primary ${
                        myEvaluation ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                    >
                      {myEvaluation ? 'Re-evaluate' : 'Evaluate'}
                    </Link>
                  </div>
                </div>
              )
            })}
            {subs.length === 0 && (
              <p className="text-sm text-slate-300 text-center py-8">No submissions yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Overall Scores Tab */}
      {activeTab === 'scores' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Overall Scoring Overview</h2>
          <div className="space-y-4">
            {subs.map(su => {
              const scores = submissionScores[su.id]
              const team = teams[su.teamId]
              const avgScore = scores ? (scores.total / scores.count).toFixed(1) : 'Not evaluated'
              
              return (
                <div key={su.id} className="rounded-lg bg-white/5 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{su.title}</h3>
                      <p className="text-sm text-slate-300">Team: {team?.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{avgScore}</div>
                      <div className="text-sm text-slate-300">
                        {scores ? `${scores.count} judge${scores.count !== 1 ? 's' : ''}` : 'No scores'}
                      </div>
                    </div>
                  </div>
                  {scores && scores.judges.length > 0 && (
                    <div className="text-sm text-slate-400">
                      Evaluated by: {scores.judges.join(', ')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Fellow Judges Tab */}
      {activeTab === 'judges' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Fellow Judges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {judges.filter(judge => judge.id !== currentUserId).map(judge => (
              <div key={judge.id} className="rounded-lg bg-white/5 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {judge.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{judge.name}</h3>
                    <p className="text-sm text-slate-300">{judge.email}</p>
                  </div>
                </div>
                
                {judge.bio && (
                  <p className="text-sm text-slate-400 mb-3">{judge.bio}</p>
                )}
                
                {judge.expertise && judge.expertise.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {judge.expertise.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {judge.linkedinUrl && (
                    <a
                      href={judge.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedJudge(judge.id)
                      setActiveTab('chat')
                    }}
                    className="flex items-center space-x-1 text-green-400 hover:text-green-300 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Judge Chat Tab */}
      {activeTab === 'chat' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Judge Communication</h2>
          
          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="mb-6">
            <div className="flex space-x-2 mb-2">
              <select
                value={selectedJudge || ''}
                onChange={(e) => setSelectedJudge(e.target.value || null)}
                className="input flex-shrink-0"
              >
                <option value="">All Judges (Group)</option>
                {judges.filter(j => j.id !== currentUserId).map(judge => (
                  <option key={judge.id} value={judge.id}>{judge.name}</option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1"
              />
              <button type="submit" className="btn-primary">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Chat Messages */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {hackathonChats.map(chat => {
              const sender = users[chat.senderId]
              const receiver = chat.receiverId ? users[chat.receiverId] : null
              
              return (
                <div key={chat.id} className="rounded-lg bg-white/5 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">
                      {sender?.name || 'Unknown'}
                      {receiver && (
                        <span className="text-slate-400"> → {receiver.name}</span>
                      )}
                      {!receiver && (
                        <span className="text-blue-400"> (Group)</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(chat.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-slate-200">{chat.message}</p>
                </div>
              )
            })}
            {hackathonChats.length === 0 && (
              <p className="text-center text-slate-400 py-8">No messages yet. Start the conversation!</p>
            )}
          </div>
        </div>
      )}

      {/* Team Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Team Feedback</h2>
          
          {/* Feedback Form */}
          <form onSubmit={handleSendFeedback} className="mb-6">
            <div className="space-y-3">
              <select
                value={selectedTeam || ''}
                onChange={(e) => setSelectedTeam(e.target.value || null)}
                className="input"
                required
              >
                <option value="">Select a team...</option>
                {Object.values(teams).map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback for the team..."
                className="input min-h-[100px]"
                required
              />
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPublicFeedback(!isPublicFeedback)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isPublicFeedback
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}
                >
                  {isPublicFeedback ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{isPublicFeedback ? 'Public Feedback' : 'Private Feedback'}</span>
                </button>
              </div>
              
              <button type="submit" className="btn-primary">
                Send Feedback
              </button>
            </div>
          </form>

          {/* Previous Feedback */}
          <div className="space-y-3">
            <h3 className="font-medium">Previous Feedback</h3>
            {teamFeedbacks
              .filter(fb => fb.judgeId === currentUserId)
              .sort((a, b) => b.createdAt - a.createdAt)
              .map(feedback => {
                const team = teams[feedback.teamId]
                return (
                  <div key={feedback.id} className="rounded-lg bg-white/5 p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">
                        Team: {team?.name || 'Unknown'}
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          feedback.isPublic
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}>
                          {feedback.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(feedback.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-slate-200">{feedback.feedback}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}
      </>)}
    </div>
  )
}
