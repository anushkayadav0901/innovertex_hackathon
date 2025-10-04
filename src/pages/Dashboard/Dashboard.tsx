import React from 'react'
import { useStore } from '@/store/useStore'
import { motion } from 'framer-motion'
import { BarChart3, Users, Trophy, Calendar, TrendingUp, Award, Target } from 'lucide-react'
import AnimatedCounter from '@/components/dashboard/AnimatedCounter'
import DonutChart from '@/components/dashboard/DonutChart'
import LineChart from '@/components/dashboard/LineChart'
import ProgressRing from '@/components/dashboard/ProgressRing'
import CalendarWidget from '@/components/dashboard/CalendarWidget'
import NotificationCards from '@/components/dashboard/NotificationCards'
import MentorDashboard from './MentorDashboard'

export default function Dashboard() {
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)

  // Route mentors to MentorDashboard; others see the generic dashboard below
  if (user?.role === 'mentor') {
    return <MentorDashboard />
  }

  const stats = [
    { 
      label: 'Active Hackathons', 
      value: 12, 
      icon: BarChart3, 
      color: 'text-blue-400',
      gradient: 'gradient-bg-1',
      change: '+23%'
    },
    { 
      label: 'Team Members', 
      value: 4, 
      icon: Users, 
      color: 'text-green-400',
      gradient: 'gradient-bg-2',
      change: '+12%'
    },
    { 
      label: 'Submissions', 
      value: 8, 
      icon: Trophy, 
      color: 'text-purple-400',
      gradient: 'gradient-bg-3',
      change: '+45%'
    },
    { 
      label: 'Events This Month', 
      value: 3, 
      icon: Calendar, 
      color: 'text-orange-400',
      gradient: 'gradient-bg-4',
      change: '+8%'
    },
  ]

  const participationData = {
    labels: ['Completed', 'In Progress', 'Upcoming', 'Cancelled'],
    values: [45, 25, 20, 10],
    colors: ['#3b5cff', '#4ecdc4', '#ffe66d', '#ff6b6b']
  }

  const submissionTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Submissions',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#3b5cff',
        backgroundColor: 'rgba(59, 92, 255, 0.1)'
      },
      {
        label: 'Wins',
        data: [2, 4, 3, 6, 5, 8],
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)'
      }
    ]
  }

  const progressData = [
    { label: 'Profile Completion', progress: 85, color: '#3b5cff' },
    { label: 'Skills Assessment', progress: 72, color: '#4ecdc4' },
    { label: 'Team Building', progress: 90, color: '#ffe66d' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-brand-200 to-purple-200 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Here's what's happening with your hackathons</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className={`dashboard-card metric-card glassmorphism rounded-2xl p-6 relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`absolute inset-0 ${stat.gradient} opacity-10`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white/10`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <div className="text-3xl font-bold text-white">
                    <AnimatedCounter end={stat.value} duration={1.5} />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="dashboard-grid">
        <motion.div
          className="dashboard-card glassmorphism rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <DonutChart
            data={participationData}
            title="Participation Statistics"
            centerText="108 Total"
            size={250}
          />
        </motion.div>

        <motion.div
          className="dashboard-card glassmorphism rounded-2xl p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <LineChart
            data={submissionTrendsData}
            title="Submission Trends Over Time"
            height={300}
          />
        </motion.div>
      </div>

      {/* Progress and Calendar Section */}
      <div className="dashboard-grid">
        <motion.div
          className="dashboard-card glassmorphism rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-400" />
            Progress Overview
          </h3>
          <div className="space-y-6">
            {progressData.map((item, index) => (
              <div key={item.label} className="flex items-center gap-4">
                <ProgressRing
                  progress={item.progress}
                  size={80}
                  strokeWidth={6}
                  color={item.color}
                  showPercentage={false}
                  duration={1.5}
                />
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.progress}% Complete</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CalendarWidget />
        </motion.div>

        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <NotificationCards />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="dashboard-card glassmorphism rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-400" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Code Warrior', desc: 'Completed 5 hackathons', color: 'bg-purple-500/20 border-purple-500/30' },
            { title: 'Team Player', desc: 'Collaborated with 10+ members', color: 'bg-blue-500/20 border-blue-500/30' },
            { title: 'Innovation Master', desc: 'Won 3 hackathons this year', color: 'bg-green-500/20 border-green-500/30' }
          ].map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className={`p-4 rounded-xl border ${achievement.color}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{achievement.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
