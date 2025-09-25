import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  type: 'no-search' | 'no-results' | 'no-filters' | 'error';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-search':
        return {
          icon: '🔍',
          defaultTitle: 'Start Your Discovery Journey',
          defaultDescription: 'Search for hackathons, teams, projects, or organizers to explore amazing innovations and connect with the community.',
          actionLabel: 'Browse All Hackathons',
          gradient: 'from-blue-400 to-purple-500'
        };
      case 'no-results':
        return {
          icon: '🤔',
          defaultTitle: 'No Results Found',
          defaultDescription: 'We couldn\'t find anything matching your search. Try different keywords or adjust your filters.',
          actionLabel: 'Clear Filters',
          gradient: 'from-orange-400 to-red-500'
        };
      case 'no-filters':
        return {
          icon: '🎯',
          defaultTitle: 'No Matches with Current Filters',
          defaultDescription: 'Your current filter selection doesn\'t match any results. Try expanding your criteria.',
          actionLabel: 'Reset Filters',
          gradient: 'from-green-400 to-blue-500'
        };
      case 'error':
        return {
          icon: '⚠️',
          defaultTitle: 'Something Went Wrong',
          defaultDescription: 'We encountered an error while searching. Please try again or contact support if the problem persists.',
          actionLabel: 'Try Again',
          gradient: 'from-red-400 to-pink-500'
        };
      default:
        return {
          icon: '🔍',
          defaultTitle: 'Nothing Here Yet',
          defaultDescription: 'Start exploring to discover amazing content.',
          actionLabel: 'Get Started',
          gradient: 'from-gray-400 to-gray-600'
        };
    }
  };

  const content = getEmptyStateContent();
  const displayTitle = title || content.defaultTitle;
  const displayDescription = description || content.defaultDescription;
  const displayActionLabel = actionLabel || content.actionLabel;

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={`flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center ${className}`}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-200 to-orange-200 dark:from-pink-800 dark:to-orange-800 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
          className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-800 dark:to-blue-800 rounded-full opacity-20 blur-xl"
        />
      </div>

      {/* Main Icon */}
      <motion.div
        variants={staggerItem}
        className="relative mb-6 sm:mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-5xl sm:text-6xl lg:text-8xl mb-2 sm:mb-4"
        >
          {content.icon}
        </motion.div>
        
        {/* Animated Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${content.gradient} opacity-20 blur-sm`}
          style={{ padding: '2rem' }}
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={staggerItem}
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 px-4"
      >
        {displayTitle}
      </motion.h2>

      {/* Description */}
      <motion.p
        variants={staggerItem}
        className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md leading-relaxed px-4"
      >
        {displayDescription}
      </motion.p>

      {/* Action Button */}
      {onAction && (
        <motion.button
          variants={staggerItem}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`
            px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r ${content.gradient} text-white font-semibold rounded-xl
            shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base
            focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
          `}
        >
          {displayActionLabel}
        </motion.button>
      )}

      {/* Helpful Tips */}
      <motion.div
        variants={staggerItem}
        className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 max-w-lg"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          💡 Search Tips
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            Try different keywords or synonyms
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            Use filters to narrow down results
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            Check your spelling and try broader terms
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            Browse categories or popular tags
          </li>
        </ul>
      </motion.div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -60, -20],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${60 + Math.random() * 20}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;
