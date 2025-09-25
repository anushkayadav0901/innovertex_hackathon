import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

interface BadgeCollectionProps {
  badges: Badge[];
  className?: string;
}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(badges.map(b => b.category)))];
  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === selectedCategory);

  const handleBadgeUnlock = (badgeId: string) => {
    setNewlyUnlocked(badgeId);
    setTimeout(() => setNewlyUnlocked(null), 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Badge Collection
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {badges.filter(b => b.unlocked).length}/{badges.length} badges earned
          </p>
        </div>
        
        {/* Progress ring */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${28 * 2 * Math.PI}`}
              strokeDashoffset={28 * 2 * Math.PI * (1 - badges.filter(b => b.unlocked).length / badges.length)}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 28 * 2 * Math.PI }}
              animate={{ strokeDashoffset: 28 * 2 * Math.PI * (1 - badges.filter(b => b.unlocked).length / badges.length) }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-gray-100">
            {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              {/* Badge */}
              <motion.div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-300 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-300 dark:border-gray-600 shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 grayscale'
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {badge.unlocked ? badge.icon : '🔒'}
                
                {/* Rarity glow */}
                {badge.unlocked && (
                  <motion.div
                    className={`absolute -inset-1 rounded-full opacity-30 blur-sm bg-gradient-to-br ${getRarityColor(badge.rarity)}`}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Unlock animation */}
              <AnimatePresence>
                {newlyUnlocked === badge.id && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Confetti burst */}
                    {Array.from({ length: 8 }).map((_, i) => (
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
                          x: Math.cos((i * Math.PI * 2) / 8) * 40,
                          y: Math.sin((i * Math.PI * 2) / 8) * 40,
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}

                    {/* Glow effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} opacity-60`}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 0] }}
                      transition={{ duration: 1.5 }}
                    />

                    {/* Pop text */}
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap"
                      initial={{ scale: 0, y: 0 }}
                      animate={{ scale: [0, 1.2, 1], y: -10 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Badge Unlocked!
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredBadge === badge.id && (
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10 max-w-48"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="font-bold">{badge.name}</div>
                    <div className="text-gray-300">{badge.description}</div>
                    {badge.unlocked && badge.unlockedAt && (
                      <div className="text-gray-400 text-xs mt-1">
                        Earned {badge.unlockedAt}
                      </div>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
            const count = badges.filter(b => b.rarity === rarity && b.unlocked).length;
            const total = badges.filter(b => b.rarity === rarity).length;
            return (
              <div key={rarity} className="text-sm">
                <div className={`text-lg font-bold bg-gradient-to-r ${getRarityColor(rarity)} bg-clip-text text-transparent`}>
                  {count}/{total}
                </div>
                <div className="text-gray-500 dark:text-gray-400 capitalize">
                  {rarity}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;
