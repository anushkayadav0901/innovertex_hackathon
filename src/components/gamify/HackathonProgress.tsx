import React from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div className={`rounded-xl p-6 bg-slate-800/50 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Hackathon Progress</h3>
        <div className="text-xs text-slate-400">{stages.filter(s => s.completed).length}/{stages.length} complete</div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className="relative"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            {/* Stage Item */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-white/10">
              {/* Status dot */}
              <div className="flex items-center justify-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 ${stage.completed ? 'border-emerald-400 bg-emerald-400' : 'border-slate-500'}`}
                  style={{ backgroundColor: stage.completed ? undefined : stage.progress > 0 ? stage.color : 'transparent', borderColor: stage.completed ? undefined : stage.progress > 0 ? stage.color : undefined }}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-100">{stage.name}</h4>
                  <span className="text-xs font-medium" style={{ color: stage.color }}>{stage.progress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ backgroundColor: stage.color, width: `${stage.progress}%`, transition: 'width 800ms ease-in-out' }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HackathonProgress;
