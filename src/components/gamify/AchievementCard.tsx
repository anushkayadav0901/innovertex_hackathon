import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  unlocked: boolean;
  progress?: number; // 0-100 for partially completed achievements
  maxProgress?: number;
  unlockedAt?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRarityConfig = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common':
        return {
          gradient: 'from-gray-400 to-gray-600',
          glow: '#9ca3af',
          border: 'border-gray-300 dark:border-gray-600',
          bg: 'bg-gray-50 dark:bg-gray-800'
        };
      case 'rare':
        return {
          gradient: 'from-blue-400 to-blue-600',
          glow: '#3b82f6',
          border: 'border-blue-300 dark:border-blue-600',
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case 'epic':
        return {
          gradient: 'from-purple-400 to-purple-600',
          glow: '#8b5cf6',
          border: 'border-purple-300 dark:border-purple-600',
          bg: 'bg-purple-50 dark:bg-purple-900/20'
        };
      case 'legendary':
        return {
          gradient: 'from-yellow-400 to-orange-500',
          glow: '#f59e0b',
          border: 'border-yellow-300 dark:border-yellow-600',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        };
    }
  };

  const config = getRarityConfig(achievement.rarity);

  return (
    <motion.div
      className={`relative p-4 rounded-xl border cursor-pointer transition-colors ${
        achievement.unlocked ? 'border-white/10 bg-white/5' : 'border-white/10 bg-slate-800/60'
      } ${className}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Minimal: removed rarity-based effects */}

      <div className="relative z-10">
        {/* Top row: lock only (rarity removed) */}
        <div className="flex items-center justify-end mb-2">
          {!achievement.unlocked && (
            <div className="text-slate-400">🔒</div>
          )}
        </div>

        {/* Icon */}
        <div className="text-center mb-3">
          <motion.div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
            {achievement.icon}
          </motion.div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h4 className={`font-bold mb-1 ${
            achievement.unlocked 
              ? 'text-gray-900 dark:text-gray-100' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {achievement.title}
          </h4>
          <p className={`text-sm ${
            achievement.unlocked 
              ? 'text-gray-600 dark:text-gray-300' 
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {achievement.description}
          </p>

          {/* Progress bar for partially completed achievements */}
          {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%`, backgroundColor: '#7c3aed', transition: 'width 800ms ease-in-out' }}
                />
              </div>
            </div>
          )}

          {/* Unlock date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-slate-400">
              Unlocked {achievement.unlockedAt}
            </div>
          )}
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {achievement.unlocked ? 'Achievement Unlocked!' : 'Keep working to unlock!'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AchievementCard;
