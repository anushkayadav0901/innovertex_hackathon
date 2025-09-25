import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyStreakProps {
  streakCount: number;
  className?: string;
}

const DailyStreak: React.FC<DailyStreakProps> = ({
  streakCount,
  className = ''
}) => {
  const [showMilestone, setShowMilestone] = useState(false);
  const isMilestone = streakCount > 0 && streakCount % 7 === 0;

  useEffect(() => {
    if (isMilestone) {
      setShowMilestone(true);
      const timer = setTimeout(() => setShowMilestone(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isMilestone]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden ${className}`}>
      {/* Milestone glow background */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Daily Streak
          </h3>
          {isMilestone && (
            <motion.div
              className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              MILESTONE!
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Flame Icon */}
          <div className="relative">
            <motion.div
              className="text-4xl"
              animate={streakCount > 0 ? {
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {streakCount > 0 ? '🔥' : '🌫️'}
            </motion.div>

            {/* Pulsing glow */}
            {streakCount > 0 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500 opacity-30 blur-lg"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Milestone sparkles */}
            <AnimatePresence>
              {showMilestone && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 8) * 30,
                        y: Math.sin((i * Math.PI * 2) / 8) * 30,
                      }}
                      exit={{ scale: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Streak Count */}
          <div>
            <motion.div
              className="text-3xl font-bold text-gray-900 dark:text-gray-100"
              key={streakCount}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {streakCount}
            </motion.div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {streakCount === 1 ? 'day' : 'days'}
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="flex-1 ml-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Next milestone: {Math.ceil(streakCount / 7) * 7} days
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(streakCount % 7) * (100 / 7)}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        {/* Streak benefits */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Streak Benefits:
          </div>
          <div className="flex gap-2 text-xs">
            <span className={`px-2 py-1 rounded ${streakCount >= 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'}`}>
              +10% XP (3 days)
            </span>
            <span className={`px-2 py-1 rounded ${streakCount >= 7 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'}`}>
              Badge (7 days)
            </span>
            <span className={`px-2 py-1 rounded ${streakCount >= 30 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'}`}>
              Special Title (30 days)
            </span>
          </div>
        </div>
      </div>

      {/* Milestone celebration popup */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            🎉 {streakCount} Day Streak!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyStreak;
