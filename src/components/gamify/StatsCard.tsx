import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import ProgressRing from './ProgressRing';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  progress?: number;
  showProgress?: boolean;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  progress,
  showProgress = false,
  tooltip,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  return (
    <motion.div
      className={`relative rounded-xl p-4 bg-slate-800/50 border border-white/10 overflow-hidden ${className}`}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
              <div style={{ color }} className="text-lg">
                {icon}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-slate-300">
                {title}
              </h3>
              {tooltip && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {tooltip}
                </p>
              )}
            </div>
          </div>
          
          {showProgress && progress !== undefined && (
            <ProgressRing
              progress={progress}
              size={52}
              strokeWidth={3}
              glowColor={color}
            >
              <span className="text-[10px] font-semibold" style={{ color }}>
                {progress}%
              </span>
            </ProgressRing>
          )}
        </div>
        
        {/* Value */}
        <div className="flex items-end gap-2">
          <AnimatedCounter
            value={value}
            className="text-2xl md:text-3xl font-semibold text-slate-100"
            prefix={prefix}
            suffix={suffix}
          />
          
          {progress !== undefined && !showProgress && (
            <motion.div
              className="flex items-center gap-1 text-xs"
              style={{ color }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span>+{progress}%</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>
        
        {/* Progress bar for non-ring progress */}
        {progress !== undefined && !showProgress && (
          <div className="mt-3">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
