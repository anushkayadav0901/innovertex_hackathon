import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/utils/id'
import type { User, SessionState, Hackathon, Team, Submission, Evaluation, Role, Announcement, FAQ, Question, JudgeChat, TeamFeedback, JudgeApplication, BeginnerModeState, HelpRequest, MentorActivity, MentorRequest, FoodCouponWindow, FoodRedemptionRecord } from './types'

type SeedData = {
  hackathons: Record<string, Hackathon>
  users: Record<string, User>
  teams: Record<string, Team>
  submissions: Record<string, Submission>
  helpRequests: Record<string, HelpRequest>
  mentorRequests: Record<string, MentorRequest>
}

interface AppState extends BeginnerModeState {
  users: Record<string, User>
  session: SessionState
  hackathons: Record<string, Hackathon>
  teams: Record<string, Team>
  submissions: Record<string, Submission>
  evaluations: Record<string, Evaluation>
  announcements: Record<string, Announcement>
  faqs: Record<string, FAQ>
  questions: Record<string, Question>
  judgeChats: Record<string, JudgeChat>
  teamFeedbacks: Record<string, TeamFeedback>
  judgeApplications: Record<string, JudgeApplication>
  helpRequests: Record<string, HelpRequest>
  mentorActivities: Record<string, MentorActivity>
  mentorRequests: Record<string, MentorRequest>
  // Food coupons
  foodWindows: Record<string, FoodCouponWindow>
  foodRedemptions: Record<string, FoodRedemptionRecord>
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
  // Judge features
  sendJudgeMessage: (hackathonId: string, message: string, receiverId?: string) => string
  addTeamFeedback: (hackathonId: string, teamId: string, feedback: string, isPublic: boolean) => string
  applyAsJudge: (hackathonId: string) => string
  // Mentor features
  createHelpRequest: (teamId: string, hackathonId: string, message: string, priority: 'urgent' | 'normal') => string
  resolveHelpRequest: (requestId: string, mentorId: string) => void
  addMentorActivity: (teamId: string, hackathonId: string, type: 'chat' | 'feedback' | 'resolved_request', note: string) => string
  // Mentor-hackathon assignment requests
  requestMentorForHackathon: (hackathonId: string, message?: string) => string
  acceptMentorRequest: (requestId: string) => void
  declineMentorRequest: (requestId: string) => void
  // Beginner mode
  toggleBeginnerMode: () => void
  startTour: () => void
  endTour: () => void
  nextTourStep: () => void
  prevTourStep: () => void
  toggleTooltips: (show?: boolean) => void
  completeTour: (tourId: string) => void
  // Special quick mode: show only the 2nd step
  showOnlySecondStep: boolean
  startSecondStepTour: () => void
  clearSecondStepTour: () => void
  // Onboarding and help state
  onboarding: {
    finishedRegistration: boolean
    joinedTeam: boolean
    readRules: boolean
    startedProject: boolean
    askedMentor: boolean
  }
  helpSeen: string[]
  markMilestone: (key: keyof AppState['onboarding'], value?: boolean) => void
  markHelpSeen: (key: string) => void
  // Food coupon actions
  activateFoodWindow: (hackathonId: string, durationHours: number) => void
  getParticipantFoodToken: (hackathonId: string, userId: string) => string | undefined
  redeemFoodToken: (token: string) => { ok: boolean; message: string; teamProgress?: { teamId: string; redeemed: number; total: number } }
  endFoodWindow: (hackathonId: string) => void
}

const seed = (): SeedData => {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

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
    startAt: now - day,
    endAt: now + 2 * day,
  }

  const h2: Hackathon = {
    id: 'hx-2',
    title: "Code Diva's Hack",
    org: 'Archi',
    dateRange: 'Oct 28 - Oct 29',
    tags: ['AI', 'Health'],
    prize: '₹2,00,000',
    description: 'AIML based hackathon with blockchain integration.',
    criteria: [
      { id: 'c1', label: 'Innovation', max: 10 },
      { id: 'c2', label: 'Feasibility', max: 10 },
      { id: 'c3', label: 'Impact', max: 10 },
    ],
    // Make hx-2 currently active as well
    startAt: now - day,
    endAt: now + day,
  }

  const h3: Hackathon = {
    id: 'hx-3',
    title: 'Web3 Builders',
    org: 'ChainWorks',
    dateRange: 'Aug 12 - Aug 14',
    tags: ['Web3', 'Blockchain'],
    prize: '₹1,50,000',
    description: 'Push the limits of decentralized apps and protocols.',
    criteria: [
      { id: 'c1', label: 'Innovation', max: 10 },
      { id: 'c2', label: 'Technical Depth', max: 10 },
      { id: 'c3', label: 'UX', max: 10 },
    ],
    startAt: now - 60 * day,
    endAt: now - 58 * day,
  }

  // Sample judges with LinkedIn profiles
  const judge1: User = {
    id: 'judge-1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@tech.com',
    role: 'judge',
    linkedinUrl: 'https://linkedin.com/in/priyasharma',
    bio: 'Senior AI Research Scientist with 10+ years in machine learning and deep learning.',
    expertise: ['AI/ML', 'Deep Learning', 'Computer Vision', 'NLP'],
    badges: []
  }

  const judge2: User = {
    id: 'judge-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@startup.io',
    role: 'judge',
    linkedinUrl: 'https://linkedin.com/in/rajeshkumar',
    bio: 'Tech entrepreneur and full-stack developer. Founded 3 successful startups.',
    expertise: ['Full Stack', 'Entrepreneurship', 'Product Management', 'React', 'Node.js'],
    badges: []
  }

  const judge3: User = {
    id: 'judge-3',
    name: 'Anita Desai',
    email: 'anita.desai@corp.com',
    role: 'judge',
    linkedinUrl: 'https://linkedin.com/in/anitadesai',
    bio: 'VP of Engineering at Fortune 500 company. Expert in scalable systems.',
    expertise: ['System Design', 'Cloud Architecture', 'DevOps', 'Leadership'],
    badges: []
  }

  const mentor1: User = {
    id: 'mentor-1',
    name: 'Sarah Johnson',
    email: 'sarah@mentor.com',
    role: 'mentor',
    bio: 'Passionate about helping teams build amazing products.',
    expertise: ['React', 'Node.js', 'System Design', 'Team Leadership'],
    badges: []
  }

  const mentor2: User = {
    id: 'mentor-2',
    name: 'Arjun Mehta',
    email: 'arjun@mentor.com',
    role: 'mentor',
    bio: 'Full‑stack engineer and hackathon coach.',
    expertise: ['TypeScript', 'Next.js', 'PostgreSQL'],
    badges: []
  }

  const mentor3: User = {
    id: 'mentor-3',
    name: 'Neha Kapoor',
    email: 'neha@mentor.com',
    role: 'mentor',
    bio: 'Product-minded mentor focused on UX and shipping.',
    expertise: ['UX', 'Product Strategy', 'React'],
    badges: []
  }

  const mentor4: User = {
    id: 'mentor-4',
    name: 'Dev Patel',
    email: 'dev@mentor.com',
    role: 'mentor',
    bio: 'Cloud and DevOps architect. Deploy fast, scale safely.',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    badges: []
  }

  const mentor5: User = {
    id: 'mentor-5',
    name: 'Ananya Rao',
    email: 'ananya@mentor.com',
    role: 'mentor',
    bio: 'ML researcher helping teams navigate data science.',
    expertise: ['Python', 'ML', 'LLMs', 'MLOps'],
    badges: []
  }

  const mentor6: User = {
    id: 'mentor-6',
    name: 'Vikram Shah',
    email: 'vikram@mentor.com',
    role: 'mentor',
    bio: 'Systems engineer with a love for performance tuning.',
    expertise: ['Golang', 'System Design', 'Databases'],
    badges: []
  }

  const participant1: User = {
    id: 'part-1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    role: 'participant',
    badges: []
  }

  const participant2: User = {
    id: 'part-2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    role: 'participant',
    badges: []
  }

  const users = {
    [judge1.id]: judge1,
    [judge2.id]: judge2,
    [judge3.id]: judge3,
    [mentor1.id]: mentor1,
    [mentor2.id]: mentor2,
    [mentor3.id]: mentor3,
    [mentor4.id]: mentor4,
    [mentor5.id]: mentor5,
    [mentor6.id]: mentor6,
    [participant1.id]: participant1,
    [participant2.id]: participant2,
  }

  const team1 = { id: 'team-1', name: 'Code Warriors', hackathonId: 'hx-1', members: ['part-1', 'part-2'] }
  const team2 = { id: 'team-2', name: 'AI Innovators', hackathonId: 'hx-1', members: ['part-1'] }
  const team3 = { id: 'team-3', name: 'Web Wizards', hackathonId: 'hx-2', members: ['part-2'] }

  const teams = { [team1.id]: team1, [team2.id]: team2, [team3.id]: team3 }

  const sub1 = { id: 'sub-1', hackathonId: 'hx-1', teamId: 'team-1', title: 'Smart Health Tracker', description: 'AI-powered health monitoring app', createdAt: now - 2 * 60 * 60 * 1000 }
  const sub2 = { id: 'sub-2', hackathonId: 'hx-1', teamId: 'team-2', title: 'EduBot AI', description: 'Conversational AI for education', createdAt: now - 4 * 60 * 60 * 1000 }

  const submissions = { [sub1.id]: sub1, [sub2.id]: sub2 }

  const req1 = { 
    id: 'req-1', 
    teamId: 'team-1', 
    hackathonId: 'hx-1', 
    message: 'Need help with React state management - our app is getting complex!', 
    priority: 'urgent' as const, 
    status: 'pending' as const, 
    createdAt: now - 30 * 60 * 1000 
  }
  const req2 = { 
    id: 'req-2', 
    teamId: 'team-2', 
    hackathonId: 'hx-1', 
    message: 'Looking for advice on choosing the right ML model for our use case', 
    priority: 'normal' as const, 
    status: 'pending' as const, 
    createdAt: now - 60 * 60 * 1000 
  }
  const req3 = { 
    id: 'req-3', 
    teamId: 'team-3', 
    hackathonId: 'hx-2', 
    message: 'Database schema design review needed', 
    priority: 'normal' as const, 
    status: 'resolved' as const, 
    assignedMentorId: 'mentor-1',
    resolvedAt: now - 10 * 60 * 1000,
    createdAt: now - 2 * 60 * 60 * 1000 
  }

  // Add a fresh pending help request for hx-2
  const req4 = {
    id: 'req-4',
    teamId: 'team-3',
    hackathonId: 'hx-2',
    message: 'Need guidance on model evaluation metrics',
    priority: 'urgent' as const,
    status: 'pending' as const,
    createdAt: now - 15 * 60 * 1000
  }

  const helpRequests = { [req1.id]: req1, [req2.id]: req2, [req3.id]: req3, [req4.id]: req4 }

  // Seed mentor requests: both hx-1 and hx-2 accepted so they appear as active
  const mr1: MentorRequest = { id: 'mreq-1', hackathonId: 'hx-1', mentorId: 'mentor-1', status: 'accepted', message: 'Happy to help health-tech teams', createdAt: now - 3 * 60 * 60 * 1000, decidedAt: now - 2 * 60 * 60 * 1000 }
  const mr2: MentorRequest = { id: 'mreq-2', hackathonId: 'hx-2', mentorId: 'mentor-1', status: 'accepted', message: 'Excited to support impact projects', createdAt: now - 90 * 60 * 1000, decidedAt: now - 60 * 60 * 1000 }
  const mentorRequests = { [mr1.id]: mr1, [mr2.id]: mr2 }

  return { 
    hackathons: { [h1.id]: h1, [h2.id]: h2 },
    users,
    teams,
    submissions,
    helpRequests,
    mentorRequests
  }
}

const initialState = {
  isBeginnerMode: false,
  currentTourStep: 0,
  completedTours: [],
  showTooltips: true,
  showOnlySecondStep: false,
  onboarding: {
    finishedRegistration: false,
    joinedTeam: false,
    readRules: false,
    startedProject: false,
    askedMentor: false,
  },
  helpSeen: [] as string[]
}

export const useStore = create<AppState>()(persist((set, get) => ({
  ...initialState,
  users: seed().users,
  session: {},
  hackathons: seed().hackathons,
  teams: seed().teams,
  submissions: seed().submissions,
  evaluations: {},
  announcements: {},
  faqs: {},
  questions: {},
  judgeChats: {},
  teamFeedbacks: {},
  judgeApplications: {},
  helpRequests: seed().helpRequests,
  mentorActivities: {},
  mentorRequests: seed().mentorRequests,
  foodWindows: {},
  foodRedemptions: {},
  login: (email) => {
    const { users } = get()
    const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
    if (user) {
      set({ session: { currentUserId: user.id } })
      // Auto-assign seeded active hackathons to mentors if none accepted yet
      if (user.role === 'mentor') {
        const state = get()
        const hasAccepted = Object.values(state.mentorRequests).some(r => r.mentorId === user.id && r.status === 'accepted')
        if (!hasAccepted) {
          const toAssign = ['hx-1', 'hx-2'].filter(hid => !!state.hackathons[hid])
          if (toAssign.length) {
            const nowTs = Date.now()
            const newReqs: Record<string, MentorRequest> = {}
            toAssign.forEach((hid, idx) => {
              const id = uid('mreq')
              newReqs[id] = { id, hackathonId: hid, mentorId: user.id, status: 'accepted', createdAt: nowTs - (idx+1)*1000, decidedAt: nowTs - idx*500 }
            })
            set(s => ({ mentorRequests: { ...s.mentorRequests, ...newReqs } }))
          }
        }
      }
    }
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
  requestMentorForHackathon: (hackathonId, message) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const me = get().users[currentUserId]
    if (me?.role !== 'mentor') throw new Error('Only mentors can request mentoring')
    // prevent duplicate for same (mentor, hackathon) regardless of status
    const existing = Object.values(get().mentorRequests).find(r => r.hackathonId === hackathonId && r.mentorId === currentUserId)
    if (existing) return existing.id
    const id = uid('mreq')
    const req: MentorRequest = { id, hackathonId, mentorId: currentUserId, status: 'pending', message, createdAt: Date.now() }
    set(state => ({ mentorRequests: { ...state.mentorRequests, [id]: req } }))
    return id
  },
  acceptMentorRequest: (requestId) => {
    set(state => {
      const r = state.mentorRequests[requestId]
      if (!r) return state
      return { mentorRequests: { ...state.mentorRequests, [requestId]: { ...r, status: 'accepted', decidedAt: Date.now() } } }
    })
  },
  declineMentorRequest: (requestId) => {
    set(state => {
      const r = state.mentorRequests[requestId]
      if (!r) return state
      return { mentorRequests: { ...state.mentorRequests, [requestId]: { ...r, status: 'declined', decidedAt: Date.now() } } }
    })
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
      const updated: Question = {
        ...q,
        answer: { authorId: currentUserId, text, createdAt: Date.now() }
      }
      return { questions: { ...state.questions, [questionId]: updated } }
    })
  },
  sendJudgeMessage: (hackathonId, message, receiverId) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const id = uid('jmsg')
    const chat: JudgeChat = {
      id,
      hackathonId,
      senderId: currentUserId,
      receiverId,
      message,
      createdAt: Date.now(),
    }
    set(state => ({ judgeChats: { ...state.judgeChats, [id]: chat } }))
    return id
  },
  addTeamFeedback: (hackathonId, teamId, feedback, isPublic) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const id = uid('tfb')
    const teamFeedback: TeamFeedback = {
      id,
      hackathonId,
      teamId,
      judgeId: currentUserId,
      feedback,
      isPublic,
      createdAt: Date.now(),
    }
    set(state => ({ teamFeedbacks: { ...state.teamFeedbacks, [id]: teamFeedback } }))
    return id
  },
  applyAsJudge: (hackathonId) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    // prevent duplicate pending/approved applications
    const existing = Object.values(get().judgeApplications).find(a => a.hackathonId === hackathonId && a.userId === currentUserId && a.status !== 'rejected')
    if (existing) return existing.id
    const id = uid('japp')
    const app: JudgeApplication = { id, hackathonId, userId: currentUserId, status: 'pending', createdAt: Date.now() }
    set(state => ({ judgeApplications: { ...state.judgeApplications, [id]: app } }))
    return id
  },
  // Mentor features
  createHelpRequest: (teamId, hackathonId, message, priority) => {
    const id = uid('req')
    const request: HelpRequest = { id, teamId, hackathonId, message, priority, status: 'pending', createdAt: Date.now() }
    set(state => ({ helpRequests: { ...state.helpRequests, [id]: request } }))
    return id
  },
  resolveHelpRequest: (requestId, mentorId) => {
    set(state => {
      const req = state.helpRequests[requestId]
      if (!req) return state
      const updated: HelpRequest = { ...req, status: 'resolved', resolvedAt: Date.now(), assignedMentorId: mentorId }
      return { helpRequests: { ...state.helpRequests, [requestId]: updated } }
    })
  },
  addMentorActivity: (teamId, hackathonId, type, note) => {
    const currentUserId = get().session.currentUserId
    if (!currentUserId) throw new Error('Not authenticated')
    const id = uid('mact')
    const activity: MentorActivity = { id, mentorId: currentUserId, teamId, hackathonId, type, note, createdAt: Date.now() }
    set(state => ({ mentorActivities: { ...state.mentorActivities, [id]: activity } }))
    return id
  },
  // Beginner mode actions
  toggleBeginnerMode: () => set(state => ({
    isBeginnerMode: !state.isBeginnerMode,
    showTooltips: !state.isBeginnerMode
  })),
  startTour: () => set({ currentTourStep: 0 }),
  endTour: () => set({ currentTourStep: -1 }),
  nextTourStep: () => set(state => ({ currentTourStep: state.currentTourStep + 1 })),
  prevTourStep: () => set(state => ({ currentTourStep: Math.max(0, state.currentTourStep - 1) })),
  toggleTooltips: (show) => set(state => ({ showTooltips: show !== undefined ? show : !state.showTooltips })),
  completeTour: (tourId) => set(state => ({ completedTours: [...new Set([...state.completedTours, tourId])] })),
  // Special quick mode handlers
  showOnlySecondStep: false,
  startSecondStepTour: () => set({ currentTourStep: 1, showOnlySecondStep: true }),
  clearSecondStepTour: () => set({ showOnlySecondStep: false }),
  // Onboarding + help actions
  markMilestone: (key, value = true) => set(state => ({ onboarding: { ...state.onboarding, [key]: value } })),
  markHelpSeen: (key) => set(state => ({ helpSeen: [...new Set([...(state.helpSeen || []), key])] })),
  // Food coupons
  activateFoodWindow: (hackathonId, durationHours) => {
    const now = Date.now()
    const endAt = now + Math.max(1, durationHours) * 60 * 60 * 1000
    set(state => {
      const existing = state.foodWindows[hackathonId]
      const window: FoodCouponWindow = { hackathonId, startAt: now, endAt, tokens: existing?.tokens || {} }
      return { foodWindows: { ...state.foodWindows, [hackathonId]: window } }
    })
  },
  getParticipantFoodToken: (hackathonId, userId) => {
    const { foodWindows, teams } = get()
    const win = foodWindows[hackathonId]
    if (!win) return undefined
    if (Date.now() < win.startAt || Date.now() > win.endAt) return undefined
    const team = Object.values(teams).find(t => t.hackathonId === hackathonId && t.members.includes(userId))
    if (!team) return undefined
    let token = win.tokens[userId]
    if (!token) {
      token = uid('food')
      set(state => {
        const w = state.foodWindows[hackathonId]
        if (!w) return state
        const updated: FoodCouponWindow = { ...w, tokens: { ...w.tokens, [userId]: token! } }
        return { foodWindows: { ...state.foodWindows, [hackathonId]: updated } }
      })
      set(state => {
        const rec: FoodRedemptionRecord = { token: token!, hackathonId, teamId: team.id, userId }
        return { foodRedemptions: { ...state.foodRedemptions, [token!]: rec } }
      })
    }
    return token
  },
  redeemFoodToken: (token) => {
    const { foodRedemptions, foodWindows, teams } = get()
    const rec = foodRedemptions[token]
    if (!rec) return { ok: false, message: 'Invalid token' }
    const win = foodWindows[rec.hackathonId]
    const now = Date.now()
    if (!win) return { ok: false, message: 'No active window' }
    if (now < win.startAt || now > win.endAt) return { ok: false, message: 'Coupon window inactive' }
    if (rec.redeemedAt) return { ok: false, message: 'Already redeemed' }
    set(state => ({ foodRedemptions: { ...state.foodRedemptions, [token]: { ...state.foodRedemptions[token], redeemedAt: Date.now() } } }))
    const team = teams[rec.teamId]
    const total = team ? team.members.length : 0
    const all = Object.values(get().foodRedemptions).filter(r => r.teamId === rec.teamId)
    const redeemed = all.filter(r => !!r.redeemedAt).length
    return { ok: true, message: 'Enjoy your meal!', teamProgress: { teamId: rec.teamId, redeemed, total } }
  },
  endFoodWindow: (hackathonId) => {
    const now = Date.now()
    set(state => {
      const win = state.foodWindows[hackathonId]
      if (!win) return state
      const updatedWin: FoodCouponWindow = { ...win, endAt: now, tokens: {} }
      const newRed: typeof state.foodRedemptions = {}
      for (const [tok, rec] of Object.entries(state.foodRedemptions)) {
        if (rec.hackathonId !== hackathonId) newRed[tok] = rec
        else if (rec.redeemedAt) newRed[tok] = rec
      }
      return { foodWindows: { ...state.foodWindows, [hackathonId]: updatedWin }, foodRedemptions: newRed }
    })
  },
}), { 
  name: 'innovortex-store',
  version: 4,
  migrate: (persisted: any, version: number) => {
    if (!persisted) return persisted
    if (version < 2) {
      return {
        ...persisted,
        // Ensure beginner mode doesn't auto-start from an older session
        isBeginnerMode: false,
        showOnlySecondStep: false,
        currentTourStep: -1,
      }
    }
    if (version < 3) {
      // Reset to load new seed data with teams, submissions, and help requests
      const seedData = seed()
      return {
        ...persisted,
        teams: seedData.teams,
        submissions: seedData.submissions,
        helpRequests: seedData.helpRequests,
      }
    }
    if (version < 4) {
      const seedData = seed()
      return {
        ...persisted,
        mentorRequests: seedData.mentorRequests || {},
      }
    }
    return persisted
  },
}))
