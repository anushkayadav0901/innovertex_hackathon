import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Award, Users, Code, Trophy, Calendar, Zap } from 'lucide-react'
import { useStore } from '@/store/useStore'
import LikeButton from './LikeButton'
import UserProfileCard from './UserProfileCard'

interface Activity {
  id: string
  userId: string
  type: 'project_submission' | 'team_join' | 'hackathon_win' | 'badge_earned' | 'comment' | 'like'
  content: string
  timestamp: Date
  metadata?: {
    projectName?: string
    teamName?: string
    hackathonName?: string
    badgeName?: string
    targetUserId?: string
  }
  likes: number
  comments: number
}

const mockActivities: Activity[] = [
  {
    id: '1',
    userId: '1',
    type: 'project_submission',
    content: 'Just submitted our AI-powered healthcare assistant to the Innovation Challenge! 🚀 Excited to see how it performs in the judging round.',
    timestamp: new Date(Date.now() - 1800000),
    metadata: { projectName: 'HealthAI Assistant', hackathonName: 'Innovation Challenge 2024' },
    likes: 15,
    comments: 8
  },
  {
    id: '2',
    userId: '2',
    type: 'badge_earned',
    content: 'Earned the "Design Master" badge for creating outstanding UI/UX designs! 🎨',
    timestamp: new Date(Date.now() - 3600000),
    metadata: { badgeName: 'Design Master' },
    likes: 23,
    comments: 5
  },
  {
    id: '3',
    userId: '3',
    type: 'hackathon_win',
    content: 'Our team "Data Wizards" won 1st place in the Climate Tech Hackathon! 🏆 Thanks to everyone who supported us!',
    timestamp: new Date(Date.now() - 7200000),
    metadata: { teamName: 'Data Wizards', hackathonName: 'Climate Tech Hackathon' },
    likes: 45,
    comments: 12
  },
  {
    id: '4',
    userId: '4',
    type: 'team_join',
    content: 'Joined the amazing "Code Crusaders" team for the upcoming Web3 hackathon! Ready to build something incredible! ⚡',
    timestamp: new Date(Date.now() - 10800000),
    metadata: { teamName: 'Code Crusaders', hackathonName: 'Web3 Future Fest' },
    likes: 12,
    comments: 3
  },
  {
    id: '5',
    userId: '5',
    type: 'comment',
    content: 'Great insights shared in today\'s workshop on "Building Scalable APIs"! Learned so much about microservices architecture. 💡',
    timestamp: new Date(Date.now() - 14400000),
    likes: 8,
    comments: 2
  }
]

interface ActivityFeedProps {
  userId?: string // If provided, show only activities from this user
  limit?: number
}

export default function ActivityFeed({ userId, limit }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observerRef = useRef<HTMLDivElement>(null)
  
  const users = useStore(s => s.users)

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreActivities()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading])

  const loadMoreActivities = async () => {
    if (loading) return
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate more mock activities
    const newActivities: Activity[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${page * 5 + i + 1}`,
      userId: ['1', '2', '3', '4', '5'][Math.floor(Math.random() * 5)],
      type: ['project_submission', 'team_join', 'badge_earned', 'comment'][Math.floor(Math.random() * 4)] as Activity['type'],
      content: [
        'Working on an exciting new project! 🚀',
        'Just joined an amazing team for the upcoming hackathon!',
        'Learned something new today in the workshop!',
        'Great collaboration with the community! 💪'
      ][Math.floor(Math.random() * 4)],
      timestamp: new Date(Date.now() - (page * 5 + i + 1) * 3600000),
      likes: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 10)
    }))

    setActivities(prev => [...prev, ...newActivities])
    setPage(prev => prev + 1)
    setLoading(false)
    
    // Stop loading after 3 pages for demo
    if (page >= 3) {
      setHasMore(false)
    }
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'project_submission':
        return <Code className="w-5 h-5 text-blue-400" />
      case 'team_join':
        return <Users className="w-5 h-5 text-green-400" />
      case 'hackathon_win':
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 'badge_earned':
        return <Award className="w-5 h-5 text-purple-400" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-cyan-400" />
      case 'like':
        return <Heart className="w-5 h-5 text-red-400" />
      default:
        return <Zap className="w-5 h-5 text-brand-400" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleLike = (activityId: string, liked: boolean) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, likes: liked ? activity.likes + 1 : Math.max(0, activity.likes - 1) }
        : activity
    ))
  }

  const filteredActivities = userId 
    ? activities.filter(activity => activity.userId === userId)
    : activities

  const displayedActivities = limit 
    ? filteredActivities.slice(0, limit)
    : filteredActivities

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {displayedActivities.map((activity, index) => {
          const user = users[activity.userId]
          if (!user) return null

          return (
            <motion.div
              key={activity.id}
              className="glassmorphism rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <UserProfileCard userId={activity.userId} compact showActions={false} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm text-slate-400">{formatTime(activity.timestamp)}</span>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed mb-4">{activity.content}</p>
                  
                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.metadata.projectName && (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-500/30">
                          📱 {activity.metadata.projectName}
                        </span>
                      )}
                      {activity.metadata.teamName && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-sm border border-green-500/30">
                          👥 {activity.metadata.teamName}
                        </span>
                      )}
                      {activity.metadata.hackathonName && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-500/30">
                          🏆 {activity.metadata.hackathonName}
                        </span>
                      )}
                      {activity.metadata.badgeName && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-full text-sm border border-yellow-500/30">
                          🏅 {activity.metadata.badgeName}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center gap-6">
                    <LikeButton
                      likeCount={activity.likes}
                      onLike={(liked) => handleLike(activity.id, liked)}
                      size="sm"
                    />
                    
                    <motion.button
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {activity.comments}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="activity-skeleton glassmorphism rounded-xl">
              <div className="avatar" />
              <div className="content">
                <div className="line short mb-2" />
                <div className="line long mb-2" />
                <div className="line short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Observer */}
      {!limit && hasMore && (
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* End Message */}
      {!hasMore && !limit && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-slate-400">You've reached the end of the activity feed</p>
        </motion.div>
      )}
    </div>
  )
}
