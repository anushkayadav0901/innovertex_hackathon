import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  maxProgress: number;
  xpReward: number;
  completed: boolean;
  expiresAt?: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestChallengesProps {
  quests: Quest[];
  className?: string;
  onQuestComplete?: (questId: string) => void;
}

const QuestChallenges: React.FC<QuestChallengesProps> = ({
  quests,
  className = '',
  onQuestComplete
}) => {
  const [completingQuest, setCompletingQuest] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');

  const filteredQuests = filter === 'all' ? quests : quests.filter(q => q.type === filter);

  const handleQuestComplete = (questId: string) => {
    setCompletingQuest(questId);
    if (onQuestComplete) onQuestComplete(questId);
    
    setTimeout(() => {
      setCompletingQuest(null);
    }, 2000);
  };

  // Solid accent colors (no gradients)
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981'; // emerald
      case 'medium': return '#f59e0b'; // amber
      case 'hard': return '#ef4444'; // red
      default: return '#94a3b8'; // slate
    }
  };

  const getTypePill = (type: string) => {
    switch (type) {
      case 'daily': return 'border-cyan-400 text-cyan-300';
      case 'weekly': return 'border-purple-400 text-purple-300';
      case 'special': return 'border-amber-400 text-amber-300';
      default: return 'border-white/10 text-slate-300';
    }
  };

  return (
    <div className={`rounded-xl p-6 bg-slate-800/50 border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            Quest Challenges
          </h3>
          <p className="text-xs text-slate-400">
            Complete quests to earn XP and unlock rewards
          </p>
        </div>
        
        {/* Progress summary */}
        <div className="text-right">
          <div className="text-xl font-semibold text-slate-100">
            {quests.filter(q => q.completed).length}/{quests.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Completed
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'daily', 'weekly', 'special'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap border ${
              filter === type
                ? 'border-emerald-400 text-emerald-300 bg-white/5'
                : 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            <span className="ml-1 text-xs opacity-75">
              ({type === 'all' ? quests.length : quests.filter(q => q.type === type).length})
            </span>
          </button>
        ))}
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ delay: index * 0.04 }}
              className={`relative p-4 rounded-xl border transition-colors ${
                quest.completed
                  ? 'bg-emerald-900/15 border-emerald-700/30'
                  : 'bg-slate-800/60 border-white/10 hover:bg-white/5'
              }`}
            >
              {/* Minimal: no confetti or XP popups */}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base border ${
                      quest.completed ? 'border-emerald-400 bg-white/5 text-emerald-300' : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    {quest.completed ? '✓' : quest.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`text-sm font-medium ${
                        quest.completed ? 'text-emerald-300' : 'text-slate-100'
                      }`}>
                        {quest.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {quest.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Type badge */}
                      <span className={`px-2 py-1 text-[10px] font-medium rounded-lg border bg-white/5 ${getTypePill(quest.type)}`}>
                        {quest.type}
                      </span>
                      {/* XP reward */}
                      <span className="px-2 py-1 text-[10px] font-semibold rounded-lg border border-white/10 bg-white/5 text-slate-200">
                        {quest.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  {!quest.completed && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{quest.progress}/{quest.maxProgress}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(quest.progress / quest.maxProgress) * 100}%`, backgroundColor: getDifficultyColor(quest.difficulty), transition: 'width 800ms ease-in-out' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-300">
                        {quest.difficulty}
                      </span>
                      {quest.expiresAt && <span>Expires: {quest.expiresAt}</span>}
                    </div>
                    
                    {quest.completed && (
                      <span className="text-emerald-400 font-medium">✓ Completed</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredQuests.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="text-4xl mb-4">🎯</div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No {filter === 'all' ? '' : filter} quests available
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new challenges!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuestChallenges;
