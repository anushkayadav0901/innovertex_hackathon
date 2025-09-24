import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Award, Users, MessageCircle, Heart, Code } from 'lucide-react'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'team_invite' | 'badge' | 'submission' | 'announcement'
  title: string
  message: string
  timestamp: Date
  read: boolean
  avatar?: string
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah liked your project submission "EcoTracker"',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40'
  },
  {
    id: '2',
    type: 'team_invite',
    title: 'Team Invitation',
    message: 'Alex Chen invited you to join "AI Innovators" team',
    timestamp: new Date(Date.now() - 900000),
    read: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40'
  },
  {
    id: '3',
    type: 'badge',
    title: 'Badge Earned!',
    message: 'You earned the "Code Warrior" badge for completing 5 hackathons',
    timestamp: new Date(Date.now() - 1800000),
    read: false
  },
  {
    id: '4',
    type: 'comment',
    title: 'New Comment',
    message: 'Marcus commented on your project: "Great work on the UI design!"',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'
  },
  {
    id: '5',
    type: 'submission',
    title: 'Submission Reminder',
    message: 'Don\'t forget to submit your project for "Climate Tech Challenge"',
    timestamp: new Date(Date.now() - 7200000),
    read: true
  }
]

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['like', 'comment', 'team_invite'][Math.floor(Math.random() * 3)] as any,
          title: 'New Activity',
          message: 'You have a new notification!',
          timestamp: new Date(),
          read: false,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=40`
        }
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-400" />
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-400" />
      case 'team_invite':
        return <Users className="w-4 h-4 text-green-400" />
      case 'badge':
        return <Award className="w-4 h-4 text-yellow-400" />
      case 'submission':
        return <Code className="w-4 h-4 text-purple-400" />
      default:
        return <Bell className="w-4 h-4 text-slate-400" />
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

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-slate-300" />
        
        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              className="notification-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="notification-dropdown open"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mark all read
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-slate-400" />
                </motion.button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">No notifications yet</p>
                </div>
              ) : (
                <div className="py-2">
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className={`relative p-4 hover:bg-white/5 transition-colors cursor-pointer border-l-2 ${
                          notification.read 
                            ? 'border-transparent opacity-70' 
                            : 'border-brand-400'
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <img
                                src={notification.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-white truncate">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-slate-400">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3 h-3 text-slate-400" />
                          </motion.button>
                        </div>
                        
                        {!notification.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-brand-400 rounded-full" />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center">
                <motion.button
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all notifications
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
