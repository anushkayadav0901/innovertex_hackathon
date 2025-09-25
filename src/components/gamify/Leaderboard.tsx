import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  level: number;
  badge?: string;
  change?: number; // Position change from last update
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [sortedEntries, setSortedEntries] = useState(entries);

  const handleSort = (type: 'score' | 'name') => {
    setSortBy(type);
    const sorted = [...entries].sort((a, b) => {
      if (type === 'score') return b.score - a.score;
      return a.name.localeCompare(b.name);
    });
    setSortedEntries(sorted);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1: return 'shadow-yellow-500/50';
      case 2: return 'shadow-gray-500/50';
      case 3: return 'shadow-orange-500/50';
      default: return 'shadow-blue-500/50';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Leaderboard
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('score')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              sortBy === 'score'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Score
          </button>
          <button
            onClick={() => handleSort('name')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              sortBy === 'name'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Name
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedEntries.map((entry, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;
            
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  isTopThree
                    ? 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-gray-300 dark:border-gray-600'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Rank glow for top 3 */}
                {isTopThree && (
                  <motion.div
                    className={`absolute -inset-1 rounded-xl opacity-20 blur-sm ${getRankGlow(rank)}`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        rank === 1 ? '#fbbf24, #f59e0b' :
                        rank === 2 ? '#9ca3af, #6b7280' :
                        '#fb923c, #ea580c'
                      })`
                    }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {isTopThree ? (
                      <motion.div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center text-white font-bold shadow-lg ${getRankGlow(rank)}`}
                        animate={rank === 1 ? {
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {getRankIcon(rank)}
                      </motion.div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                        {getRankIcon(rank)}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {entry.name}
                      </h4>
                      {entry.badge && (
                        <span className="text-sm">{entry.badge}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Level {entry.level}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {entry.score.toLocaleString()}
                    </div>
                    {entry.change !== undefined && (
                      <motion.div
                        className={`text-sm flex items-center gap-1 ${
                          entry.change > 0 ? 'text-green-500' : 
                          entry.change < 0 ? 'text-red-500' : 'text-gray-500'
                        }`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {entry.change > 0 && '↗'}
                        {entry.change < 0 && '↘'}
                        {entry.change === 0 && '→'}
                        {Math.abs(entry.change)}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Crown shimmer for #1 */}
                {rank === 1 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Silver glow for #2 */}
                {rank === 2 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-400/10 to-transparent"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Bronze sparkle for #3 */}
                {rank === 3 && (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-orange-400 rounded-full"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${20 + i * 20}%`
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
