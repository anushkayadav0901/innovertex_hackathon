import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle, AlertTriangle, Info, Award, Users } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'achievement' | 'team'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'New Badge Earned!',
    message: 'You\'ve earned the "Code Warrior" badge for completing 5 hackathons.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    action: {
      label: 'View Badge',
      onClick: () => console.log('View badge')
    }
  },
  {
    id: '2',
    type: 'team',
    title: 'Team Invitation',
    message: 'Alex Chen invited you to join "AI Innovators" team for the upcoming hackathon.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    action: {
      label: 'Accept',
      onClick: () => console.log('Accept invitation')
    }
  },
  {
    id: '3',
    type: 'warning',
    title: 'Submission Deadline',
    message: 'Your project submission for "Climate Tech Challenge" is due in 2 hours.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false
  },
  {
    id: '4',
    type: 'success',
    title: 'Project Approved',
    message: 'Your project "EcoTracker" has been approved for the final round.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Workshop Reminder',
    message: 'Don\'t forget about the "Advanced React Patterns" workshop starting at 3 PM.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true
  }
]

export default function NotificationCards() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showAll, setShowAll] = useState(false)

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      case 'achievement':
        return <Award className="w-5 h-5 text-purple-400" />
      case 'team':
        return <Users className="w-5 h-5 text-cyan-400" />
      default:
        return <Bell className="w-5 h-5 text-slate-400" />
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10'
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10'
      case 'achievement':
        return 'border-purple-500/30 bg-purple-500/10'
      case 'team':
        return 'border-cyan-500/30 bg-cyan-500/10'
      default:
        return 'border-slate-500/30 bg-slate-500/10'
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

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3)

  return (
    <div className="glassmorphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-400" />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <motion.span
              className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {unreadCount}
            </motion.span>
          )}
        </div>
        {notifications.length > 3 && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAll ? 'Show Less' : 'View All'}
          </motion.button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayedNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`notification-slide relative p-4 rounded-xl border transition-all duration-300 ${
                getTypeColor(notification.type)
              } ${
                notification.read ? 'opacity-70' : ''
              }`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100, height: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-3 h-3 text-slate-400" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        notification.action!.onClick()
                      }}
                      className="mt-3 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {notification.action.label}
                    </motion.button>
                  )}
                </div>
              </div>
              
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-brand-400 rounded-full" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">No notifications yet</p>
        </motion.div>
      )}
    </div>
  )
}
