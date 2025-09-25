import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StageInfo } from '../data/stageData';

interface StageDetailModalProps {
  stageInfo: StageInfo | null;
  isOpen: boolean;
  onClose: () => void;
  isJudgeMode: boolean;
}

const StageDetailModal: React.FC<StageDetailModalProps> = ({
  stageInfo,
  isOpen,
  onClose,
  isJudgeMode
}) => {
  if (!stageInfo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '100%' }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: '100%' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div 
              className="p-6 border-b border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: `${stageInfo.color}10` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: stageInfo.color }}
                  >
                    {stageInfo.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {stageInfo.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stage {stageInfo.id + 1} of 5
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Overview
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {stageInfo.fullDescription}
                </p>
              </div>

              {/* Key Activities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stageInfo.color }} />
                  Key Activities
                </h3>
                <ul className="space-y-2">
                  {stageInfo.tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <span 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: stageInfo.color }}
                      />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Judge Mode Information */}
              {isJudgeMode && stageInfo.judgeNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                    <span>⚖️</span>
                    Judge Evaluation
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                        Criteria: {stageInfo.judgeCriteria}
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        {stageInfo.judgeNotes}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tips */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Pro Tips
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {stageInfo.id === 0 && (
                    <>
                      <li>• Complete your profile thoroughly for better team matching</li>
                      <li>• Join the community Discord for real-time updates</li>
                    </>
                  )}
                  {stageInfo.id === 1 && (
                    <>
                      <li>• Research existing solutions to avoid duplication</li>
                      <li>• Look for diverse skill sets when forming teams</li>
                    </>
                  )}
                  {stageInfo.id === 2 && (
                    <>
                      <li>• Set up version control early in the process</li>
                      <li>• Focus on core functionality first, then add features</li>
                    </>
                  )}
                  {stageInfo.id === 3 && (
                    <>
                      <li>• Practice your pitch beforehand with teammates</li>
                      <li>• Prepare for technical questions about your solution</li>
                    </>
                  )}
                  {stageInfo.id === 4 && (
                    <>
                      <li>• Network with other participants and mentors</li>
                      <li>• Document your learnings for future hackathons</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: stageInfo.color,
                  color: 'white'
                }}
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StageDetailModal;
