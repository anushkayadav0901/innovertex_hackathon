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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'weekly': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'special': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Quest Challenges
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete quests to earn XP and unlock rewards
          </p>
        </div>
        
        {/* Progress summary */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {quests.filter(q => q.completed).length}/{quests.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
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
            className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap transition-colors ${
              filter === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                quest.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {/* Quest completion celebration */}
              <AnimatePresence>
                {completingQuest === quest.id && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Confetti burst */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][i % 5],
                          left: '50%',
                          top: '50%'
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}

                    {/* XP gain popup */}
                    <motion.div
                      className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-sm"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      +{quest.xpReward} XP
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      quest.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                    animate={quest.completed ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {quest.completed ? '✓' : quest.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        quest.completed 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {quest.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {quest.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Type badge */}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(quest.type)}`}>
                        {quest.type}
                      </span>
                      
                      {/* XP reward */}
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {quest.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  {!quest.completed && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{quest.progress}/{quest.maxProgress}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getDifficultyColor(quest.difficulty)} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          onAnimationComplete={() => {
                            if (quest.progress >= quest.maxProgress && !quest.completed) {
                              handleQuestComplete(quest.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded bg-gradient-to-r ${getDifficultyColor(quest.difficulty)} text-white font-medium`}>
                        {quest.difficulty}
                      </span>
                      {quest.expiresAt && (
                        <span>Expires: {quest.expiresAt}</span>
                      )}
                    </div>
                    
                    {quest.completed && (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✓ Completed
                      </span>
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
