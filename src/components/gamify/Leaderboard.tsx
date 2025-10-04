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
  showHeader?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  className = '',
  showHeader = false
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
    if (rank === 1) return '1';
    if (rank === 2) return '2';
    if (rank === 3) return '3';
    return `#${rank}`;
  };

  const rankBorderClass = (rank: number) => {
    if (rank === 1) return 'border-amber-300/60';
    if (rank === 2) return 'border-slate-300/40';
    if (rank === 3) return 'border-orange-300/50';
    return 'border-white/10';
  };

  return (
    <div className={`rounded-xl p-6 bg-slate-800/50 border border-white/10 ${className}`}>
      {/* Header (optional) */}
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Leaderboard</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('score')}
              className={`px-3 py-1 text-xs rounded-lg border ${
                sortBy === 'score'
                  ? 'border-cyan-400 text-cyan-300 bg-white/5'
                  : 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10'
              }`}
            >
              Score
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1 text-xs rounded-lg border ${
                sortBy === 'name'
                  ? 'border-cyan-400 text-cyan-300 bg-white/5'
                  : 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10'
              }`}
            >
              Name
            </button>
          </div>
        </div>
      )}

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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className={`relative p-3 rounded-xl border bg-slate-800/60 hover:bg-white/5 transition-colors ${rankBorderClass(rank)}`}
                whileHover={{ y: -2 }}
              >
                <div className="relative z-10 flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-slate-100 text-sm font-semibold border ${rankBorderClass(rank)} bg-white/5`}>
                      {getRankIcon(rank)}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-9 h-9 rounded-full border border-white/10"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 font-semibold">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-100 truncate" title={entry.name}>
                        {entry.name}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-400">Level {entry.level}</div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-semibold text-slate-100 leading-tight">
                      {entry.score.toLocaleString()}
                      <span className="ml-1 text-[11px] text-slate-400">pts</span>
                    </div>
                    {entry.change !== undefined && (
                      <div className={`text-xs flex items-center justify-end gap-1 ${
                        entry.change > 0 ? 'text-emerald-400' : 
                        entry.change < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {entry.change > 0 && '↗'}
                        {entry.change < 0 && '↘'}
                        {entry.change === 0 && '→'}
                        {Math.abs(entry.change)}
                      </div>
                    )}
                  </div>
                </div>
                {/* subtle separator */}
                <div className="mt-3 h-px bg-white/5" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
