import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  progress: number; // 0-100
  color: string;
}

interface HackathonProgressProps {
  stages: Stage[];
  className?: string;
}

const HackathonProgress: React.FC<HackathonProgressProps> = ({
  stages,
  className = ''
}) => {
  const [celebratingStage, setCelebratingStage] = useState<string | null>(null);

  const handleStageComplete = (stageId: string) => {
    setCelebratingStage(stageId);
    setTimeout(() => setCelebratingStage(null), 2000);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Hackathon Progress
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {stages.filter(s => s.completed).length}/{stages.length} Complete
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Stage Item */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {/* Icon */}
              <div className="relative">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                    stage.completed
                      ? 'bg-green-500 text-white shadow-lg'
                      : stage.progress > 0
                      ? 'text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                  style={{
                    backgroundColor: stage.progress > 0 && !stage.completed ? stage.color : undefined,
                    boxShadow: stage.progress > 0 ? `0 0 20px ${stage.color}40` : undefined
                  }}
                  animate={stage.completed ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {stage.completed ? '✓' : stage.icon}
                </motion.div>

                {/* Pulsing ring for active stage */}
                {stage.progress > 0 && stage.progress < 100 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 opacity-60"
                    style={{ borderColor: stage.color }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {stage.name}
                  </h4>
                  <span className="text-sm font-medium" style={{ color: stage.color }}>
                    {stage.progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: stage.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    onAnimationComplete={() => {
                      if (stage.progress === 100 && !stage.completed) {
                        handleStageComplete(stage.id);
                      }
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Connection line to next stage */}
              {index < stages.length - 1 && (
                <div className="absolute left-10 top-16 w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
              )}
            </div>

            {/* Celebration Effect */}
            <AnimatePresence>
              {celebratingStage === stage.id && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Confetti particles */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
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

                  {/* Success message */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
                    initial={{ scale: 0, y: 0 }}
                    animate={{ scale: [0, 1.2, 1], y: -20 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Stage Complete! 🎉
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HackathonProgress;
