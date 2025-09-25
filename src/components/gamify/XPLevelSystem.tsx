import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface XPLevelSystemProps {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  totalXPForNextLevel: number;
  className?: string;
  onLevelUp?: (newLevel: number) => void;
}

const XPLevelSystem: React.FC<XPLevelSystemProps> = ({
  currentXP,
  level,
  xpToNextLevel,
  totalXPForNextLevel,
  className = '',
  onLevelUp
}) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);
  const [xpGain, setXpGain] = useState(0);
  const [showXpGain, setShowXpGain] = useState(false);

  const currentLevelXP = totalXPForNextLevel - xpToNextLevel;
  const progressPercentage = (currentLevelXP / totalXPForNextLevel) * 100;

  // Handle level up
  useEffect(() => {
    if (level > previousLevel) {
      setShowLevelUp(true);
      if (onLevelUp) onLevelUp(level);
      
      setTimeout(() => {
        setShowLevelUp(false);
        setPreviousLevel(level);
      }, 3000);
    }
  }, [level, previousLevel, onLevelUp]);

  // Simulate XP gain animation
  const handleXPGain = (amount: number) => {
    setXpGain(amount);
    setShowXpGain(true);
    setTimeout(() => setShowXpGain(false), 2000);
  };

  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Novice Hacker';
    if (level < 10) return 'Code Explorer';
    if (level < 15) return 'Digital Architect';
    if (level < 20) return 'Innovation Master';
    if (level < 25) return 'Tech Wizard';
    if (level < 30) return 'Cyber Legend';
    return 'Hackathon God';
  };

  const getLevelColor = (level: number) => {
    if (level < 5) return 'from-gray-400 to-gray-600';
    if (level < 10) return 'from-green-400 to-green-600';
    if (level < 15) return 'from-blue-400 to-blue-600';
    if (level < 20) return 'from-purple-400 to-purple-600';
    if (level < 25) return 'from-pink-400 to-pink-600';
    if (level < 30) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden ${className}`}>
      {/* Level up celebration background */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Level Progress
            </h3>
            <p className={`text-sm font-medium bg-gradient-to-r ${getLevelColor(level)} bg-clip-text text-transparent`}>
              {getLevelTitle(level)}
            </p>
          </div>
          
          {/* Level badge */}
          <motion.div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            whileHover={{ scale: 1.1 }}
            animate={showLevelUp ? {
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0]
            } : {}}
            transition={{ duration: 1 }}
          >
            {level}
          </motion.div>
        </div>

        {/* XP Display */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Experience Points
            </span>
            <div className="flex items-center gap-2">
              <AnimatedCounter
                value={currentXP}
                className="text-lg font-bold text-gray-900 dark:text-gray-100"
                suffix=" XP"
              />
              
              {/* XP gain animation */}
              <AnimatePresence>
                {showXpGain && (
                  <motion.div
                    className="text-green-500 font-bold text-sm"
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 2 }}
                  >
                    +{xpGain} XP
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            
            {/* Progress fill */}
            <motion.div
              className={`h-full bg-gradient-to-r ${getLevelColor(level)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Particle sparkles */}
              {progressPercentage > 0 && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 60 + 20}%`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5 + Math.random(),
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          </div>

          {/* XP Info */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{currentLevelXP.toLocaleString()} / {totalXPForNextLevel.toLocaleString()} XP</span>
            <span>{xpToNextLevel.toLocaleString()} XP to next level</span>
          </div>
        </div>

        {/* Level Rewards Preview */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Next Level Rewards:
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              +500 XP Bonus
            </span>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
              New Badge Frame
            </span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              Profile Theme
            </span>
          </div>
        </div>

        {/* Test XP Gain Button (for demo) */}
        <button
          onClick={() => handleXPGain(Math.floor(Math.random() * 100) + 50)}
          className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          Simulate XP Gain
        </button>
      </div>

      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti burst */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][i % 6],
                  left: '50%',
                  top: '50%'
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Level up text */}
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-2xl"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.2, 1], rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 500, damping: 30 }}
            >
              🎉 LEVEL UP! 🎉
              <div className="text-sm font-normal">
                Welcome to Level {level}!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XPLevelSystem;
