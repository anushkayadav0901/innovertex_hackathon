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
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        achievement.unlocked ? config.border : 'border-gray-200 dark:border-gray-700'
      } ${
        achievement.unlocked ? config.bg : 'bg-gray-100 dark:bg-gray-800'
      } ${className}`}
      whileHover={{ 
        scale: 1.05,
        rotateY: isHovered ? 5 : 0,
        rotateX: isHovered ? 5 : 0
      }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Rarity glow effect */}
      {achievement.unlocked && (
        <motion.div
          className="absolute -inset-1 rounded-xl opacity-20 blur-sm"
          style={{ backgroundColor: config.glow }}
          animate={
            achievement.rarity === 'rare' ? {
              opacity: [0.1, 0.3, 0.1]
            } : achievement.rarity === 'epic' ? {
              scale: [0.95, 1.05, 0.95],
              opacity: [0.2, 0.4, 0.2]
            } : achievement.rarity === 'legendary' ? {
              opacity: [0.3, 0.6, 0.3]
            } : {}
          }
          transition={{
            duration: achievement.rarity === 'rare' ? 3 : 
                     achievement.rarity === 'epic' ? 2 : 
                     achievement.rarity === 'legendary' ? 1.5 : 0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Legendary shimmer effect */}
      {achievement.unlocked && achievement.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Epic particle glow */}
      {achievement.unlocked && achievement.rarity === 'epic' && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i % 2) * 70}%`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}

      {/* Rare sparkle twinkle */}
      {achievement.unlocked && achievement.rarity === 'rare' && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full"
              style={{
                left: `${30 + i * 25}%`,
                top: `${20 + i * 30}%`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5 + Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}

      <div className="relative z-10">
        {/* Rarity badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 text-xs font-bold rounded-full text-white bg-gradient-to-r ${config.gradient} capitalize`}>
            {achievement.rarity}
          </span>
          {!achievement.unlocked && (
            <div className="text-gray-400 dark:text-gray-500">
              🔒
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="text-center mb-3">
          <motion.div
            className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}
            animate={achievement.unlocked && achievement.rarity === 'legendary' ? {
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
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
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}

          {/* Unlock date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
