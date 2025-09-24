import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Award, Users, Github, Linkedin, ExternalLink, MessageCircle, UserPlus } from 'lucide-react'
import { useStore } from '@/store/useStore'

interface UserStats {
  hackathonsJoined: number
  projectsCompleted: number
  teamsFormed: number
  badgesEarned: number
  winRate: number
}

interface UserProfileCardProps {
  userId: string
  showActions?: boolean
  compact?: boolean
}

const mockUserStats: Record<string, UserStats> = {
  '1': { hackathonsJoined: 15, projectsCompleted: 12, teamsFormed: 8, badgesEarned: 23, winRate: 67 },
  '2': { hackathonsJoined: 8, projectsCompleted: 6, teamsFormed: 4, badgesEarned: 12, winRate: 75 },
  '3': { hackathonsJoined: 22, projectsCompleted: 18, teamsFormed: 12, badgesEarned: 31, winRate: 82 },
  '4': { hackathonsJoined: 5, projectsCompleted: 4, teamsFormed: 2, badgesEarned: 8, winRate: 80 },
  '5': { hackathonsJoined: 11, projectsCompleted: 9, teamsFormed: 6, badgesEarned: 18, winRate: 64 }
}

const mockUserProfiles: Record<string, any> = {
  '1': {
    bio: 'Full-stack developer passionate about AI and machine learning. Love building innovative solutions!',
    location: 'San Francisco, CA',
    joinDate: new Date(2023, 0, 15),
    skills: ['React', 'Node.js', 'Python', 'TensorFlow'],
    interests: ['AI/ML', 'Web Development', 'Open Source'],
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.dev'
  },
  '2': {
    bio: 'UI/UX Designer with a passion for creating beautiful and intuitive user experiences.',
    location: 'New York, NY',
    joinDate: new Date(2023, 3, 22),
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    interests: ['Design Systems', 'Accessibility', 'Mobile Design'],
    linkedin: 'https://linkedin.com/in/janesmith'
  },
  '3': {
    bio: 'Data scientist and ML engineer. Building the future with data-driven insights.',
    location: 'Austin, TX',
    joinDate: new Date(2022, 8, 10),
    skills: ['Python', 'R', 'TensorFlow', 'PyTorch'],
    interests: ['Machine Learning', 'Data Visualization', 'Statistics'],
    github: 'https://github.com/alexchen'
  }
}

export default function UserProfileCard({ userId, showActions = true, compact = false }: UserProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const users = useStore(s => s.users)
  const currentUserId = useStore(s => s.session.currentUserId)
  
  const user = users[userId]
  const stats = mockUserStats[userId] || mockUserStats['1']
  const profile = mockUserProfiles[userId] || mockUserProfiles['1']
  const isCurrentUser = userId === currentUserId

  if (!user) return null

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (compact) {
    return (
      <motion.div
        className="profile-card-hover glassmorphism rounded-xl p-4 relative overflow-hidden"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="online-indicator">
            <img
              src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60`}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{user.name}</h3>
            <p className="text-sm text-slate-300 capitalize">{user.role}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
              <span>{stats.hackathonsJoined} hackathons</span>
              <span>{stats.winRate}% win rate</span>
            </div>
          </div>
          {showActions && !isCurrentUser && (
            <motion.button
              onClick={handleFollow}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isFollowing
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-brand-500/20 text-brand-400 border border-brand-500/30 hover:bg-brand-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="profile-card-hover glassmorphism rounded-2xl p-6 relative overflow-hidden max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="online-indicator mx-auto mb-4">
          <img
            src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120`}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white/20"
          />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-brand-200 capitalize mb-2">{user.role}</p>
        {profile.location && (
          <div className="flex items-center justify-center gap-1 text-sm text-slate-400">
            <MapPin className="w-4 h-4" />
            {profile.location}
          </div>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-6">
          <p className="text-sm text-slate-300 leading-relaxed text-center">{profile.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-400">{stats.hackathonsJoined}</div>
          <div className="text-xs text-slate-400">Hackathons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.winRate}%</div>
          <div className="text-xs text-slate-400">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.teamsFormed}</div>
          <div className="text-xs text-slate-400">Teams</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.badgesEarned}</div>
          <div className="text-xs text-slate-400">Badges</div>
        </div>
      </div>

      {/* Skills */}
      {profile.skills && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">Top Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 4).map((skill: string) => (
              <span
                key={skill}
                className="px-2 py-1 bg-white/10 text-xs text-slate-300 rounded-full border border-white/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex justify-center gap-3 mb-6">
        {profile.github && (
          <motion.a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="w-4 h-4 text-slate-300" />
          </motion.a>
        )}
        {profile.linkedin && (
          <motion.a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin className="w-4 h-4 text-slate-300" />
          </motion.a>
        )}
        {profile.website && (
          <motion.a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ExternalLink className="w-4 h-4 text-slate-300" />
          </motion.a>
        )}
      </div>

      {/* Actions */}
      {showActions && !isCurrentUser && (
        <div className="flex gap-2">
          <motion.button
            onClick={handleFollow}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isFollowing
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-brand-500 hover:bg-brand-600 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-4 h-4 mr-2 inline" />
            {isFollowing ? 'Following' : 'Follow'}
          </motion.button>
          <motion.button
            className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* Join Date */}
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          Joined {formatJoinDate(profile.joinDate)}
        </div>
      </div>
    </motion.div>
  )
}
