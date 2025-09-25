import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { Team, Stage } from '../hooks/useQuestMapData';

interface CompetitiveLeaderboardProps {
  teams: Team[];
  stages: Stage[];
  isVisible: boolean;
  onToggle: () => void;
}

const CompetitiveLeaderboard: React.FC<CompetitiveLeaderboardProps> = ({
  teams,
  stages,
  isVisible,
  onToggle
}) => {
  // Sort teams by progress (stage index) and then by rank
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.stageIndex !== b.stageIndex) {
      return b.stageIndex - a.stageIndex; // Higher stage first
    }
    if (a.rank && b.rank) {
      return a.rank - b.rank; // Lower rank number is better
    }
    if (a.rank && !b.rank) return -1;
    if (!a.rank && b.rank) return 1;
    return 0;
  });

  const getProgressPercentage = (team: Team) => {
    return ((team.stageIndex + 1) / stages.length) * 100;
  };

  const getStageIcon = (stageIndex: number) => {
    const icons = ['🚪', '💡', '🏗️', '🎭', '🏆'];
    return icons[stageIndex] || '📍';
  };

  const getRankIcon = (rank?: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2: return <Star className="w-4 h-4 text-gray-400" />;
      case 3: return <Zap className="w-4 h-4 text-orange-500" />;
      default: return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg hover:bg-opacity-70 transition-all z-40"
      >
        📊 Leaderboard
      </button>

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 w-80 max-h-96 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/20">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  🏆 Live Rankings
                </h3>
                <button
                  onClick={onToggle}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {sortedTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white/60">
                        #{index + 1}
                      </span>
                      {getRankIcon(team.rank)}
                      <span className="font-semibold truncate" style={{ color: team.color }}>
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{getStageIcon(team.stageIndex)}</span>
                      <span className="text-white/80">
                        {stages[team.stageIndex]?.name.split(' ')[0] || 'Start'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: team.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(team)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-white/60">
                    <span>{team.members.length} members</span>
                    <span>{Math.round(getProgressPercentage(team))}% complete</span>
                  </div>

                  {/* Motivational badges */}
                  <div className="flex gap-1 mt-2">
                    {team.stageIndex >= 1 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        💡 Ideated
                      </span>
                    )}
                    {team.stageIndex >= 2 && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        🔨 Building
                      </span>
                    )}
                    {team.stageIndex >= 3 && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                        🎤 Pitched
                      </span>
                    )}
                    {team.rank && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                        🏆 Winner
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="p-3 bg-white/5 text-xs text-white/60">
              <div className="flex justify-between">
                <span>{teams.length} teams competing</span>
                <span>{teams.filter(t => t.stageIndex >= stages.length - 1).length} finished</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompetitiveLeaderboard;
