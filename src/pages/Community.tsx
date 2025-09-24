import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageCircle, Activity, TrendingUp } from 'lucide-react'
import ChatInterface from '@/components/community/ChatInterface'
import ActivityFeed from '@/components/community/ActivityFeed'
import UserProfileCard from '@/components/community/UserProfileCard'
import CommentSystem from '@/components/community/CommentSystem'
import { useStore } from '@/store/useStore'

export default function Community() {
  const [activeTab, setActiveTab] = useState<'feed' | 'chat' | 'members'>('feed')
  const users = useStore(s => s.users)
  const currentUserId = useStore(s => s.session.currentUserId)

  const tabs = [
    { id: 'feed', label: 'Activity Feed', icon: Activity },
    { id: 'chat', label: 'Community Chat', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users }
  ]

  const featuredMembers = Object.keys(users).slice(0, 6)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Connect, collaborate, and celebrate with fellow innovators from around the world
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-400">2.5K+</div>
            <div className="text-sm text-slate-300">Active Members</div>
          </div>
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">150+</div>
            <div className="text-sm text-slate-300">Teams Formed</div>
          </div>
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">500+</div>
            <div className="text-sm text-slate-300">Projects Shared</div>
          </div>
          <div className="glassmorphism rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">1.2K+</div>
            <div className="text-sm text-slate-300">Collaborations</div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="glassmorphism rounded-2xl p-2 flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl"
                      layoutId="activeTabBg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'feed' && (
                <div className="space-y-6">
                  <ActivityFeed />
                </div>
              )}
              
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <ChatInterface roomId="community-general" title="General Discussion" height="600px" />
                  
                  {/* Sample Post with Comments */}
                  <div className="glassmorphism rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-white">Alex Chen</h3>
                        <p className="text-sm text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">
                      Just finished our AI-powered healthcare assistant! The team worked incredibly hard, and I'm so proud of what we've built. 
                      The user interface is intuitive, and the ML model is performing better than expected. Can't wait to present it! 🚀
                    </p>
                    <div className="border-t border-white/10 pt-4">
                      <CommentSystem postId="sample-post" />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'members' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.keys(users).map((userId) => (
                    <UserProfileCard
                      key={userId}
                      userId={userId}
                      showActions={userId !== currentUserId}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Members */}
            <motion.div
              className="glassmorphism rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-400" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {featuredMembers.map((userId) => (
                  <UserProfileCard
                    key={userId}
                    userId={userId}
                    compact
                    showActions={false}
                  />
                ))}
              </div>
            </motion.div>

            {/* Recent Activity Preview */}
            <motion.div
              className="glassmorphism rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-400" />
                Recent Activity
              </h3>
              <ActivityFeed limit={3} />
            </motion.div>

            {/* Community Guidelines */}
            <motion.div
              className="glassmorphism rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-1">•</span>
                  Be respectful and inclusive to all members
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-1">•</span>
                  Share knowledge and help others learn
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-1">•</span>
                  Keep discussions relevant and constructive
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 mt-1">•</span>
                  Celebrate achievements and support each other
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
