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
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}20, transparent)`
        }}
      />
      
      {/* Glow effect */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${color}15` }}
            >
              <div style={{ color }} className="text-xl">
                {icon}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h3>
              {tooltip && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {tooltip}
                </p>
              )}
            </div>
          </div>
          
          {showProgress && progress !== undefined && (
            <ProgressRing
              progress={progress}
              size={60}
              strokeWidth={4}
              glowColor={color}
            >
              <span className="text-xs font-bold" style={{ color }}>
                {progress}%
              </span>
            </ProgressRing>
          )}
        </div>
        
        {/* Value */}
        <div className="flex items-end gap-2">
          <AnimatedCounter
            value={value}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            prefix={prefix}
            suffix={suffix}
          />
          
          {progress !== undefined && !showProgress && (
            <motion.div
              className="flex items-center gap-1 text-sm"
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
          <div className="mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Sparkle effect */}
      <motion.div
        className="absolute top-4 right-4 w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      />
    </motion.div>
  );
};

export default StatsCard;
