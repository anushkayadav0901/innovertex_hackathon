import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Award, BarChart3, Trophy } from 'lucide-react'
import StatsCard from '../components/gamify/StatsCard'
import DailyStreak from '../components/gamify/DailyStreak'
import Leaderboard from '../components/gamify/Leaderboard'
import AchievementCard from '../components/gamify/AchievementCard'
import BadgeCollection from '../components/gamify/BadgeCollection'
import XPLevelSystem from '../components/gamify/XPLevelSystem'
// removed HackathonProgress and QuestChallenges sections per request

export default function Gamify() {

  // Sample data
  const statsData = [
    {
      title: 'Points',
      value: 12450,
      icon: <Trophy className="h-5 w-5" />,
      color: '#10b981',
      progress: 75,
      tooltip: 'Earn points by completing hackathon milestones',
      suffix: ' pts'
    },
    {
      title: 'Rank',
      value: 12,
      icon: <BarChart3 className="h-5 w-5" />,
      color: '#06b6d4',
      showProgress: true,
      progress: 88,
      prefix: '#'
    },
    {
      title: 'Badges',
      value: 24,
      icon: <Award className="h-5 w-5" />,
      color: '#f59e0b',
      progress: 15,
      tooltip: 'Unlock badges by achieving milestones'
    }
  ]

  // removed hackathonStages data

  const leaderboardData = [
    {
      id: '1',
      name: 'Alex Chen',
      score: 15420,
      level: 28,
      badge: '',
      change: 2,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Sarah Kumar',
      score: 14890,
      level: 26,
      badge: '',
      change: -1
    },
    {
      id: '3',
      name: 'Mike Johnson',
      score: 14250,
      level: 25,
      badge: '',
      change: 1
    },
    {
      id: '4',
      name: 'You',
      score: 12450,
      level: 22,
      badge: '',
      change: 3
    },
    {
      id: '5',
      name: 'Emma Wilson',
      score: 11890,
      level: 21,
      change: 0
    }
  ]

  const achievements = [
    {
      id: 'hackathon-legend',
      title: 'Launch Ready',
      description: 'Win 3 hackathons in a row',
      icon: '',
      rarity: 'legendary' as const,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: 'first-win',
      title: 'First Victory',
      description: 'Win your first hackathon',
      icon: '',
      rarity: 'rare' as const,
      unlocked: true,
      unlockedAt: '2 months ago'
    },
    {
      id: 'back-to-back',
      title: 'Back-to-Back',
      description: 'Win 2 hackathons consecutively',
      icon: '',
      rarity: 'epic' as const,
      unlocked: false,
      progress: 1,
      maxProgress: 2
    },
    {
      id: 'triple-streak',
      title: 'Triple Crown',
      description: 'Win 3 hackathons consecutively',
      icon: '',
      rarity: 'legendary' as const,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: 'five-wins',
      title: 'Champion of Five',
      description: 'Win 5 hackathons overall',
      icon: '',
      rarity: 'epic' as const,
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: 'podium-streak',
      title: 'Podium Streak',
      description: 'Reach the podium 3 times in a row',
      icon: '',
      rarity: 'rare' as const,
      unlocked: false,
      progress: 2,
      maxProgress: 3
    }
  ]

  const badges = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      icon: '',
      description: 'Registered within first 24 hours',
      unlocked: true,
      category: 'participation',
      rarity: 'common' as const,
      unlockedAt: '3 days ago'
    },
    {
      id: 'code-ninja',
      name: 'Tech Explorer',
      icon: '',
      description: 'Wrote 1000+ lines of code',
      unlocked: true,
      category: 'coding',
      rarity: 'rare' as const,
      unlockedAt: '1 day ago'
    },
    {
      id: 'bug-hunter',
      name: 'Bug Hunter',
      icon: '',
      description: 'Fixed 10 critical bugs',
      unlocked: false,
      category: 'debugging',
      rarity: 'epic' as const
    },
    {
      id: 'innovation-master',
      name: 'Innovation Master',
      icon: '',
      description: 'Created groundbreaking solution',
      unlocked: false,
      category: 'innovation',
      rarity: 'legendary' as const
    }
  ]

  // removed quests data

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="card p-5 md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  <a href="/dashboard" className="hover:text-slate-200">Dashboard</a>
                  <span className="mx-2 text-slate-600">/</span>
                  <span className="text-slate-300">Progress</span>
                </div>
                <h1 className="text-2xl sm:text-[28px] font-semibold text-emerald-300">Progress</h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">Keep building—you’re one step closer to launch!</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 bg-gradient-to-b from-white/5 to-transparent px-3 py-1.5">
                  <Award className="h-4 w-4 text-emerald-300" />
                  <span className="text-xs text-slate-300">Level</span>
                  <span className="text-sm font-semibold text-slate-100">22</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 bg-gradient-to-b from-white/5 to-transparent px-3 py-1.5">
                  <Flame className="h-4 w-4 text-amber-300" />
                  <span className="text-xs text-slate-300">Streak</span>
                  <span className="text-sm font-semibold text-slate-100">14d</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 bg-gradient-to-b from-white/5 to-transparent px-3 py-1.5">
                  <BarChart3 className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs text-slate-300">Rank</span>
                  <span className="text-sm font-semibold text-slate-100">#12</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="card p-6 mb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.35)]">
          <h2 className="text-lg font-semibold text-emerald-300 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsData.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP & Level System */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-emerald-300 mb-4">Experience Level</h2>
              <XPLevelSystem
                currentXP={12450}
                level={22}
                xpToNextLevel={2550}
                totalXPForNextLevel={15000}
                onLevelUp={(level) => console.log(`Level up to ${level}!`)}
              />
            </div>

            {/* Achievements Section (moved up to fill space) */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-emerald-300 mb-4">Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClick={() => console.log(`Clicked ${achievement.title}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Daily Streak */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-emerald-300 mb-4">Streak</h2>
              <DailyStreak streakCount={14} />
            </div>

            {/* Leaderboard */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-emerald-300 mb-4">Leaderboard</h2>
              <Leaderboard entries={leaderboardData} />
            </div>

            {/* Badges Section (moved up to fill space) */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-emerald-300 mb-4">Badges</h2>
              <BadgeCollection badges={badges} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
