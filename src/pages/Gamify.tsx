import React, { useState } from 'react'
import { motion } from 'framer-motion'
import StatsCard from '../components/gamify/StatsCard'
import HackathonProgress from '../components/gamify/HackathonProgress'
import DailyStreak from '../components/gamify/DailyStreak'
import Leaderboard from '../components/gamify/Leaderboard'
import AchievementCard from '../components/gamify/AchievementCard'
import BadgeCollection from '../components/gamify/BadgeCollection'
import XPLevelSystem from '../components/gamify/XPLevelSystem'
import QuestChallenges from '../components/gamify/QuestChallenges'
import ConfettiCelebration from '../components/gamify/ConfettiCelebration'

export default function Gamify() {
  const [celebrationTrigger, setCelebrationTrigger] = useState(false)

  // Sample data
  const statsData = [
    {
      title: 'Total Points',
      value: 12450,
      icon: '🏆',
      color: '#3b82f6',
      progress: 75,
      tooltip: 'Earn points by completing hackathon milestones',
      suffix: ' pts'
    },
    {
      title: 'Current Rank',
      value: 12,
      icon: '📊',
      color: '#10b981',
      showProgress: true,
      progress: 88,
      prefix: '#'
    },
    {
      title: 'Badges Earned',
      value: 24,
      icon: '🎖️',
      color: '#f59e0b',
      progress: 15,
      tooltip: 'Unlock badges by achieving milestones'
    }
  ]

  const hackathonStages = [
    {
      id: 'registration',
      name: 'Registration',
      icon: '📝',
      completed: true,
      progress: 100,
      color: '#10b981'
    },
    {
      id: 'team-formation',
      name: 'Team Formation',
      icon: '👥',
      completed: true,
      progress: 100,
      color: '#3b82f6'
    },
    {
      id: 'prototype',
      name: 'Prototype Development',
      icon: '⚙️',
      completed: false,
      progress: 75,
      color: '#f59e0b'
    },
    {
      id: 'submission',
      name: 'Final Submission',
      icon: '🚀',
      completed: false,
      progress: 25,
      color: '#ef4444'
    }
  ]

  const leaderboardData = [
    {
      id: '1',
      name: 'Alex Chen',
      score: 15420,
      level: 28,
      badge: '👑',
      change: 2,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Sarah Kumar',
      score: 14890,
      level: 26,
      badge: '🥈',
      change: -1
    },
    {
      id: '3',
      name: 'Mike Johnson',
      score: 14250,
      level: 25,
      badge: '🥉',
      change: 1
    },
    {
      id: '4',
      name: 'You',
      score: 12450,
      level: 22,
      badge: '⭐',
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
      id: 'first-commit',
      title: 'First Commit',
      description: 'Made your first code commit',
      icon: '💻',
      rarity: 'common' as const,
      unlocked: true,
      unlockedAt: '2 days ago'
    },
    {
      id: 'team-player',
      title: 'Team Player',
      description: 'Collaborated with 5+ team members',
      icon: '🤝',
      rarity: 'rare' as const,
      unlocked: true,
      unlockedAt: '1 week ago'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete a challenge in under 1 hour',
      icon: '⚡',
      rarity: 'epic' as const,
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: 'hackathon-legend',
      title: 'Hackathon Legend',
      description: 'Win 3 hackathons in a row',
      icon: '🏆',
      rarity: 'legendary' as const,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    }
  ]

  const badges = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      icon: '🐦',
      description: 'Registered within first 24 hours',
      unlocked: true,
      category: 'participation',
      rarity: 'common' as const,
      unlockedAt: '3 days ago'
    },
    {
      id: 'code-ninja',
      name: 'Code Ninja',
      icon: '🥷',
      description: 'Wrote 1000+ lines of code',
      unlocked: true,
      category: 'coding',
      rarity: 'rare' as const,
      unlockedAt: '1 day ago'
    },
    {
      id: 'bug-hunter',
      name: 'Bug Hunter',
      icon: '🐛',
      description: 'Fixed 10 critical bugs',
      unlocked: false,
      category: 'debugging',
      rarity: 'epic' as const
    },
    {
      id: 'innovation-master',
      name: 'Innovation Master',
      icon: '💡',
      description: 'Created groundbreaking solution',
      unlocked: false,
      category: 'innovation',
      rarity: 'legendary' as const
    }
  ]

  const quests = [
    {
      id: 'daily-commit',
      title: 'Daily Commit',
      description: 'Make at least 3 commits today',
      type: 'daily' as const,
      progress: 2,
      maxProgress: 3,
      xpReward: 100,
      completed: false,
      icon: '💻',
      difficulty: 'easy' as const,
      expiresAt: '11:59 PM'
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Review 5 pull requests from teammates',
      type: 'weekly' as const,
      progress: 3,
      maxProgress: 5,
      xpReward: 500,
      completed: false,
      icon: '🤝',
      difficulty: 'medium' as const,
      expiresAt: 'Sunday'
    },
    {
      id: 'innovation-challenge',
      title: 'Innovation Challenge',
      description: 'Implement a unique feature using AI',
      type: 'special' as const,
      progress: 1,
      maxProgress: 1,
      xpReward: 1000,
      completed: true,
      icon: '🚀',
      difficulty: 'hard' as const
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎮 Game Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your progress, earn rewards, and compete with others
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* XP & Level System */}
            <XPLevelSystem
              currentXP={12450}
              level={22}
              xpToNextLevel={2550}
              totalXPForNextLevel={15000}
              onLevelUp={(level) => console.log(`Level up to ${level}!`)}
            />

            {/* Hackathon Progress */}
            <HackathonProgress stages={hackathonStages} />

            {/* Quest Challenges */}
            <QuestChallenges 
              quests={quests}
              onQuestComplete={(questId) => console.log(`Quest ${questId} completed!`)}
            />

            {/* Milestone Celebration */}
            <ConfettiCelebration
              trigger={celebrationTrigger}
              onComplete={() => setCelebrationTrigger(false)}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Daily Streak */}
            <DailyStreak streakCount={14} />

            {/* Leaderboard */}
            <Leaderboard entries={leaderboardData} />
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            🏆 Achievements
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onClick={() => console.log(`Clicked ${achievement.title}`)}
              />
            ))}
          </div>
        </div>

        {/* Badge Collection */}
        <div className="mt-12">
          <BadgeCollection badges={badges} />
        </div>
      </div>
    </div>
  )
}
