import React from 'react';
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

  const currentLevelXP = totalXPForNextLevel - xpToNextLevel;
  const progressPercentage = (currentLevelXP / totalXPForNextLevel) * 100;

  // Minimal: no celebratory animations; call onLevelUp if provided
  // when consumer updates the prop.
  // Intentionally no internal timers or effects for clean UI.

  const getLevelTitle = (lvl: number) => {
    if (lvl < 5) return 'Innovator';
    if (lvl < 10) return 'Tech Explorer';
    if (lvl < 15) return 'Team Catalyst';
    if (lvl < 20) return 'Product Builder';
    if (lvl < 25) return 'Solution Architect';
    if (lvl < 30) return 'Launch Leader';
    return 'Trailblazer';
  };

  return (
    <div className={`rounded-xl p-4 bg-slate-800/50 border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-100">Level Progress</h3>
          <p className="text-xs text-slate-400">{getLevelTitle(level)}</p>
        </div>
        {/* Level pill */}
        <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-100 text-sm font-semibold">
          {level}
        </div>
      </div>

      {/* XP Display */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Experience Points</span>
          <AnimatedCounter
            value={currentXP}
            className="text-base sm:text-lg font-semibold text-slate-100"
            suffix=" XP"
          />
        </div>
        {/* Progress Bar */}
        <div className="relative h-2.5 rounded-full bg-slate-700 overflow-hidden" aria-label="XP progress" role="progressbar" aria-valuenow={Math.round(progressPercentage)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {/* XP Info */}
        <div className="flex justify-between text-[11px] text-slate-400 mt-2">
          <span>{currentLevelXP.toLocaleString()} / {totalXPForNextLevel.toLocaleString()} XP</span>
          <span>{xpToNextLevel.toLocaleString()} XP to next level</span>
        </div>
      </div>

      {/* Level Rewards Preview (minimal) */}
      <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="text-xs text-slate-300 mb-1">Next level rewards</div>
        <ul className="text-[11px] text-slate-400 list-disc pl-5 space-y-0.5">
          <li>+500 XP bonus</li>
          <li>New badge frame</li>
          <li>Profile theme</li>
        </ul>
      </div>
    </div>
  );
};

export default XPLevelSystem;
