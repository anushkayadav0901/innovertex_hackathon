import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tag {
  id: string;
  label: string;
  count: number;
  category?: string;
  color?: string;
}

interface TagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagClick: (tagId: string) => void;
  maxTags?: number;
  className?: string;
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  selectedTags,
  onTagClick,
  maxTags = 50,
  className = ''
}) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Sort tags by count and limit display
  const displayTags = useMemo(() => {
    const sorted = [...tags].sort((a, b) => b.count - a.count);
    return showAll ? sorted : sorted.slice(0, maxTags);
  }, [tags, maxTags, showAll]);

  // Calculate font size based on tag frequency
  const getFontSize = (count: number) => {
    const maxCount = Math.max(...tags.map(t => t.count));
    const minCount = Math.min(...tags.map(t => t.count));
    const ratio = (count - minCount) / (maxCount - minCount);
    return 0.75 + ratio * 1.5; // Range from 0.75rem to 2.25rem
  };

  // Get tag color
  const getTagColor = (tag: Tag, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 text-white border-blue-500';
    }
    if (isHovered) {
      return 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600';
    }
    if (tag.color) {
      return `bg-${tag.color}-50 text-${tag.color}-700 border-${tag.color}-200 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300 dark:border-${tag.color}-700`;
    }
    return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1
      }
    }
  };

  const tagVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    }
  };

  const pulseVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Popular Tags
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click tags to filter results
            </p>
          </div>
          
          {tags.length > maxTags && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors"
            >
              {showAll ? 'Show Less' : `Show All (${tags.length})`}
            </motion.button>
          )}
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
        <AnimatePresence mode="popLayout">
          {displayTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            const isHovered = hoveredTag === tag.id;
            const fontSize = getFontSize(tag.count);

            return (
              <motion.button
                key={tag.id}
                variants={tagVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
                whileTap="tap"
                layout
                onClick={() => onTagClick(tag.id)}
                onMouseEnter={() => setHoveredTag(tag.id)}
                onMouseLeave={() => setHoveredTag(null)}
                className={`
                  relative px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer
                  border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500
                  ${isSelected 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                  }
                `}
                style={{ fontSize: '0.875rem' }}
              >
                {/* Tag Content */}
                <span className="relative z-10 flex items-center gap-1">
                  {tag.label}
                  <span className={`text-xs opacity-75 ${isSelected ? 'text-blue-100' : ''}`}>
                    ({tag.count})
                  </span>
                </span>

                {/* Hover Effect */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
                    />
                  )}
                </AnimatePresence>

                {/* Selection Ring */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      className="absolute -inset-1 bg-blue-500 rounded-full opacity-20 animate-pulse"
                    />
                  )}
                </AnimatePresence>

                {/* Ripple Effect on Click */}
                <motion.div
                  key={`ripple-${tag.id}`}
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
        </motion.div>
      </div>

      {/* Tag Statistics */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {selectedTags.length > 0 
              ? `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`
              : 'No tags selected'
            }
          </span>
          <span>
            {displayTags.length} of {tags.length} tags shown
          </span>
        </div>

        {/* Selected Tags Summary */}
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex flex-wrap gap-1"
            >
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2">
                Active filters:
              </span>
              {selectedTags.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                if (!tag) return null;
                
                return (
                  <motion.span
                    key={tagId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {tag.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick(tagId);
                      }}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </motion.span>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TagCloud;
