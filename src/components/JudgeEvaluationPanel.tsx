import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, Clock, Users } from 'lucide-react';
import { Team, Stage } from '../hooks/useQuestMapData';

interface JudgeEvaluationPanelProps {
  selectedTeam: Team | null;
  stages: Stage[];
  onClose: () => void;
  onEvaluate: (teamId: string, evaluation: TeamEvaluation) => void;
}

interface TeamEvaluation {
  innovation: number;
  technical: number;
  presentation: number;
  impact: number;
  feedback: string;
  approved: boolean;
}

const JudgeEvaluationPanel: React.FC<JudgeEvaluationPanelProps> = ({
  selectedTeam,
  stages,
  onClose,
  onEvaluate
}) => {
  const [evaluation, setEvaluation] = useState<TeamEvaluation>({
    innovation: 0,
    technical: 0,
    presentation: 0,
    impact: 0,
    feedback: '',
    approved: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedTeam) return null;

  const handleRatingChange = (category: keyof TeamEvaluation, value: number) => {
    if (typeof evaluation[category] === 'number') {
      setEvaluation(prev => ({ ...prev, [category]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onEvaluate(selectedTeam.id, evaluation);
    setIsSubmitting(false);
    onClose();
  };

  const StarRating: React.FC<{ 
    value: number; 
    onChange: (value: number) => void;
    label: string;
  }> = ({ value, onChange, label }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-200 mb-2">
        {label}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`p-1 transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-500'
            }`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  const currentStage = stages[selectedTeam.stageIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Judge Evaluation
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: selectedTeam.color }}
                    />
                    {selectedTeam.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedTeam.members.length} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentStage?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Team Info */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Team Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Members</h4>
                <ul className="text-sm text-gray-400">
                  {selectedTeam.members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Progress</h4>
                <div className="text-sm text-gray-400">
                  <p>Current Stage: {currentStage?.name}</p>
                  <p>Progress: {Math.round(((selectedTeam.stageIndex + 1) / stages.length) * 100)}%</p>
                  {selectedTeam.rank && <p>Current Rank: #{selectedTeam.rank}</p>}
                </div>
              </div>
            </div>
            
            {selectedTeam.submissionLink && (
              <div className="mt-4">
                <a
                  href={selectedTeam.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  View Submission
                </a>
              </div>
            )}
          </div>

          {/* Evaluation Form */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Evaluation Criteria</h3>
            
            <StarRating
              value={evaluation.innovation}
              onChange={(value) => handleRatingChange('innovation', value)}
              label="Innovation & Creativity"
            />
            
            <StarRating
              value={evaluation.technical}
              onChange={(value) => handleRatingChange('technical', value)}
              label="Technical Implementation"
            />
            
            <StarRating
              value={evaluation.presentation}
              onChange={(value) => handleRatingChange('presentation', value)}
              label="Presentation Quality"
            />
            
            <StarRating
              value={evaluation.impact}
              onChange={(value) => handleRatingChange('impact', value)}
              label="Potential Impact"
            />

            {/* Feedback */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Feedback & Comments
              </label>
              <textarea
                value={evaluation.feedback}
                onChange={(e) => setEvaluation(prev => ({ ...prev, feedback: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                rows={4}
                placeholder="Provide constructive feedback for the team..."
              />
            </div>

            {/* Approval */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={evaluation.approved}
                  onChange={(e) => setEvaluation(prev => ({ ...prev, approved: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-200">
                  Approve team to advance to next stage
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Evaluation
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JudgeEvaluationPanel;
