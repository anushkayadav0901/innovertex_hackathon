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

  const getRarityAccent = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a3b8';
      case 'rare': return '#38bdf8';
      case 'epic': return '#a78bfa';
      case 'legendary': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className={`rounded-xl p-6 bg-slate-800/50 border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Badge Collection</h3>
          <p className="text-xs text-slate-400">{badges.filter(b => b.unlocked).length}/{badges.length} badges earned</p>
        </div>
        {/* Progress ring (subtle) */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
            <circle cx="24" cy="24" r="20" stroke="#06b6d4" strokeWidth="4" fill="transparent" strokeDasharray={`${20 * 2 * Math.PI}`} strokeDashoffset={20 * 2 * Math.PI * (1 - badges.filter(b => b.unlocked).length / badges.length)} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-200">
            {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap border ${
              selectedCategory === category
                ? 'border-emerald-400 text-emerald-300 bg-white/5'
                : 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(64px,1fr))]">
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
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-xl border transition-colors ${
                  badge.unlocked
                    ? 'border-emerald-400 bg-white/5'
                    : 'border-white/10 bg-white/5'
                }`}
                title={badge.name}
              >
                <span className={`text-slate-200 ${badge.unlocked ? '' : 'opacity-40'}`}>{badge.icon || '🔖'}</span>
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-slate-700/70 text-slate-300 text-xs flex items-center justify-center border border-white/10">🔒</div>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredBadge === badge.id && (
                  <motion.div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-slate-100 text-xs p-2 rounded whitespace-nowrap z-10 max-w-48"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-slate-300">{badge.description}</div>
                    {badge.unlocked && badge.unlockedAt && (
                      <div className="text-slate-400 text-[10px] mt-1">Earned {badge.unlockedAt}</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
            const count = badges.filter(b => b.rarity === rarity && b.unlocked).length;
            const total = badges.filter(b => b.rarity === rarity).length;
            return (
              <div key={rarity} className="text-sm">
                <div className="text-base font-semibold" style={{ color: getRarityAccent(rarity) }}>{count}/{total}</div>
                <div className="text-slate-400 capitalize">{rarity}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;
