export type Role = 'participant' | 'organizer' | 'judge'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  badges?: string[]
  linkedinUrl?: string
  bio?: string
  expertise?: string[]
}

export interface SessionState {
  currentUserId?: string
}

export interface Hackathon {
  id: string
  title: string
  org: string
  organizerId?: string
  dateRange: string
  tags: string[]
  prize: string
  description: string
  criteria: { id: string; label: string; max: number }[]
  // Optional timeline fields for categorizing into active/past/upcoming
  startAt?: number // epoch ms
  endAt?: number // epoch ms
}

export interface Team {
  id: string
  name: string
  hackathonId: string
  members: string[] // user ids
}

export interface Submission {
  id: string
  hackathonId: string
  teamId: string
  title: string
  repoUrl?: string
  figmaUrl?: string
  driveUrl?: string
  deckUrl?: string
  description?: string
  createdAt: number
}

export interface Evaluation {
  id: string
  hackathonId: string
  submissionId: string
  judgeId: string
  scores: { criterionId: string; score: number }[]
  feedback?: string
  createdAt: number
}

export interface Announcement {
  id: string
  hackathonId: string
  authorId: string
  message: string
  createdAt: number
}

export interface FAQ {
  id: string
  hackathonId: string
  question: string
  answer: string
}

export interface Question {
  id: string
  hackathonId: string
  authorId: string
  text: string
  answer?: { authorId: string; text: string; createdAt: number }
  createdAt: number
}

export interface JudgeChat {
  id: string
  hackathonId: string
  senderId: string
  receiverId?: string // if undefined, it's a group message
  message: string
  createdAt: number
}

export interface TeamFeedback {
  id: string
  hackathonId: string
  teamId: string
  judgeId: string
  feedback: string
  isPublic: boolean
  createdAt: number
}

export interface JudgeApplication {
  id: string
  hackathonId: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}
