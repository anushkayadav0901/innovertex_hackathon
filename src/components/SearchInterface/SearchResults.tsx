import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'team' | 'project' | 'organizer';
  image?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  matchedFields?: string[];
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  onResultClick: (result: SearchResult) => void;
  onPageChange: (page: number) => void;
  className?: string;
}

// Highlight matching text in search results
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <motion.mark
            key={index}
            initial={{ backgroundColor: 'transparent' }}
            animate={{ backgroundColor: '#fef3c7' }}
            className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded"
          >
            {part}
          </motion.mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// Individual result card component
const ResultCard: React.FC<{
  result: SearchResult;
  query: string;
  onClick: () => void;
  index: number;
}> = ({ result, query, onClick, index }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hackathon': return '🏆';
      case 'team': return '👥';
      case 'project': return '💡';
      case 'organizer': return '🏢';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hackathon': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'team': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'project': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'organizer': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Image/Icon */}
        <div className="flex-shrink-0">
          {result.image ? (
            <img
              src={result.image}
              alt={result.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
              {getTypeIcon(result.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <HighlightText text={result.title} query={query} />
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getTypeColor(result.type)}`}>
              {result.type}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            <HighlightText text={result.description} query={query} />
          </p>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {result.tags.slice(0, 4).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                >
                  <HighlightText text={tag} query={query} />
                </span>
              ))}
              {result.tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 text-xs rounded-full">
                  +{result.tags.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          {result.metadata && (
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {Object.entries(result.metadata).slice(0, 3).map(([key, value]) => (
                <span key={key} className="flex items-center gap-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Matched Fields Indicator */}
          {result.matchedFields && result.matchedFields.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Matches in:</span>
              <div className="flex gap-1">
                {result.matchedFields.map((field) => (
                  <span
                    key={field}
                    className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Arrow Indicator */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </motion.button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </motion.button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </motion.button>
    </div>
  );
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading,
  totalCount,
  currentPage,
  itemsPerPage,
  onResultClick,
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Loading Skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-12 ${className}`}
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No results found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We couldn't find anything matching "<strong>{query}</strong>"
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search terms or filters
        </div>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {/* Results Header */}
      {totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Search Results
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex}-{endIndex} of {totalCount} results
              {query && (
                <span> for "<strong>{query}</strong>"</span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {results.map((result, index) => (
            <ResultCard
              key={result.id}
              result={result}
              query={query}
              onClick={() => onResultClick(result)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SearchResults;
