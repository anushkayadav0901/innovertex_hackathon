import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/utils/id'
import type { User, SessionState, Hackathon, Team, Submission, Evaluation, Role, Announcement, FAQ, Question } from './types'

interface AppState {
  users: Record<string, User>
  session: SessionState
  hackathons: Record<string, Hackathon>
  teams: Record<string, Team>
  submissions: Record<string, Submission>
  evaluations: Record<string, Evaluation>
  announcements: Record<string, Announcement>
  faqs: Record<string, FAQ>
  questions: Record<string, Question>
  // Auth
  login: (email: string) => void
  logout: () => void
  signup: (name: string, email: string, role: Role) => void
  // Hackathons & participation
  createHackathon: (payload: Omit<Hackathon, 'id' | 'organizerId'> & { organizerId?: string }) => string
  registerTeam: (hackathonId: string, teamName: string) => string
  joinTeam: (teamId: string) => void
  submitProject: (hackathonId: string, teamId: string, payload: Partial<Submission>) => string
  addEvaluation: (submissionId: string, scores: Evaluation['scores'], feedback?: string) => string
  // Comms
  addAnnouncement: (hackathonId: string, message: string) => string
  addFAQ: (hackathonId: string, question: string, answer: string) => string
  askQuestion: (hackathonId: string, text: string) => string
  answerQuestion: (questionId: string, text: string) => void
}

const seed = () => {
  const h1: Hackathon = {
    id: 'hx-1',
    title: 'Innovortex 4.0',
    org: 'Innovortex',
    dateRange: 'Oct 15 - Oct 17',
    tags: ['AI', 'Web'],
    prize: '₹1,00,000',
    description: 'Flagship innovation sprint focusing on real-world problem statements with AI and web technologies.',
    criteria: [
      { id: 'c1', label: 'Innovation', max: 10 },
      { id: 'c2', label: 'Technical Depth', max: 10 },
      { id: 'c3', label: 'Impact', max: 10 },
      { id: 'c4', label: 'Presentation', max: 10 },
    ],
  }
  return { hackathons: { [h1.id]: h1 } }
}

export const useStore = create<AppState>()(persist((set, get) => ({
  users: {},
  session: {},
  hackathons: seed().hackathons,
  teams: {},
  submissions: {},
  evaluations: {},
  announcements: {},
  faqs: {},
  questions: {},
  login: (email) => {
    const { users } = get()
    const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
    if (user) set({ session: { currentUserId: user.id } })
    else throw new Error('No account found with this email')
  },
  logout: () => set({ session: {} }),
  signup: (name, email, role) => {
    const id = uid('usr')
    const user: User = { id, name, email, role, badges: [] }
    set(state => ({ users: { ...state.users, [id]: user }, session: { currentUserId: id } }))
  },
  createHackathon: (payload) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const id = uid('hx')
    const hack: Hackathon = { id, organizerId: currentUserId, ...payload }
    set(state => ({ hackathons: { ...state.hackathons, [id]: hack } }))
    return id
  },
  registerTeam: (hackathonId, teamName) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const teamId = uid('team')
    const team: Team = { id: teamId, name: teamName, hackathonId, members: [currentUserId] }
    set(state => ({ teams: { ...state.teams, [teamId]: team } }))
    return teamId
  },
  joinTeam: (teamId) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    set(state => {
      const t = state.teams[teamId]
      if (!t) return state
      if (!t.members.includes(currentUserId)) {
        t.members = [...t.members, currentUserId]
      }
      return { teams: { ...state.teams, [teamId]: t } }
    })
  },
  submitProject: (hackathonId, teamId, payload) => {
    const id = uid('sub')
    const submission: Submission = {
      id,
      hackathonId,
      teamId,
      title: payload.title || 'Project Submission',
      repoUrl: payload.repoUrl,
      figmaUrl: payload.figmaUrl,
      driveUrl: payload.driveUrl,
      deckUrl: payload.deckUrl,
      description: payload.description,
      createdAt: Date.now(),
    }
    set(state => ({ submissions: { ...state.submissions, [id]: submission } }))
    return id
  },
  addEvaluation: (submissionId, scores, feedback) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const sub = get().submissions[submissionId]
    if (!sub) throw new Error('Submission not found')
    const id = uid('eval')
    const evaluation: Evaluation = {
      id,
      hackathonId: sub.hackathonId,
      submissionId,
      judgeId: currentUserId,
      scores,
      feedback,
      createdAt: Date.now(),
    }
    set(state => ({ evaluations: { ...state.evaluations, [id]: evaluation } }))
    return id
  },
  addAnnouncement: (hackathonId, message) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const id = uid('ann')
    const ann: Announcement = { id, hackathonId, authorId: currentUserId, message, createdAt: Date.now() }
    set(state => ({ announcements: { ...state.announcements, [id]: ann } }))
    return id
  },
  addFAQ: (hackathonId, question, answer) => {
    const id = uid('faq')
    const faq: FAQ = { id, hackathonId, question, answer }
    set(state => ({ faqs: { ...state.faqs, [id]: faq } }))
    return id
  },
  askQuestion: (hackathonId, text) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const id = uid('q')
    const q: Question = { id, hackathonId, authorId: currentUserId, text, createdAt: Date.now() }
    set(state => ({ questions: { ...state.questions, [id]: q } }))
    return id
  },
  answerQuestion: (questionId, text) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    set(state => {
      const q = state.questions[questionId]
      if (!q) return state
      q.answer = { authorId: currentUserId, text, createdAt: Date.now() }
      return { questions: { ...state.questions, [questionId]: q } }
    })
  },
}), { name: 'innovortex-store' }))
