import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'text',
  animation = 'pulse',
  lines = 1,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: '',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]}`}
            style={{
              ...skeletonStyle,
              width: index === lines - 1 ? '75%' : skeletonStyle.width, // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={skeletonStyle}
    />
  );
};

// Predefined skeleton layouts
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton width="60%" height="1rem" className="mb-2" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
    </div>
    <Skeleton variant="rectangular" height="200px" className="mb-4" />
    <Skeleton lines={3} />
  </div>
);

export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-4 p-4 ${className}`}>
    <Skeleton variant="circular" width={48} height={48} />
    <div className="flex-1">
      <Skeleton width="80%" height="1rem" className="mb-2" />
      <Skeleton width="60%" height="0.875rem" />
    </div>
    <Skeleton width={80} height="2rem" variant="rounded" />
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({ 
  columns = 4, 
  className = '' 
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <Skeleton height="1rem" />
      </td>
    ))}
  </tr>
);

export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-center ${className}`}>
    <Skeleton variant="circular" width={120} height={120} className="mx-auto mb-4" />
    <Skeleton width="60%" height="1.5rem" className="mx-auto mb-2" />
    <Skeleton width="40%" height="1rem" className="mx-auto mb-4" />
    <div className="flex justify-center space-x-4 mb-6">
      <Skeleton width={80} height="2rem" variant="rounded" />
      <Skeleton width={80} height="2rem" variant="rounded" />
    </div>
    <Skeleton lines={4} />
  </div>
);

// Progressive loading component
interface ProgressiveLoaderProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  fadeInDuration?: number;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  isLoading,
  skeleton,
  children,
  delay = 0,
  fadeInDuration = 0.3,
}) => {
  return (
    <motion.div
      initial={false}
      animate={isLoading ? 'loading' : 'loaded'}
      variants={{
        loading: { opacity: 1 },
        loaded: { opacity: 1 },
      }}
      transition={{ delay, duration: fadeInDuration }}
    >
      {isLoading ? skeleton : children}
    </motion.div>
  );
};

// Staggered loading for lists
interface StaggeredSkeletonListProps {
  count: number;
  skeleton: React.ComponentType<{ className?: string }>;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredSkeletonList: React.FC<StaggeredSkeletonListProps> = ({
  count,
  skeleton: SkeletonComponent,
  className = '',
  staggerDelay = 0.1,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * staggerDelay,
            duration: 0.3,
            ease: 'easeOut',
          }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  );
};

// Content placeholder with shimmer effect
export const ShimmerPlaceholder: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ width = '100%', height = '200px', className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

export default Skeleton;
