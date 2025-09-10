import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = 'md',
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200';
  
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'rounded-md',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could implement wave animation with CSS
    none: '',
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  // Default dimensions for variants
  const defaultDimensions = {
    rectangular: { width: '100%', height: '1rem' },
    circular: { width: '2.5rem', height: '2.5rem' },
    text: { width: '100%', height: '1rem' },
  };
  
  if (!width && !height) {
    Object.assign(style, defaultDimensions[variant]);
  }

  return (
    <div
      className={clsx(
        baseClasses,
        roundedClasses[rounded],
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Skeleton compositions for common use cases
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={clsx('space-y-4', className)}>
    {/* Table header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} height="1.5rem" />
      ))}
    </div>
    
    {/* Table rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

interface SkeletonCardProps {
  withImage?: boolean;
  withAvatar?: boolean;
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  withImage = false, 
  withAvatar = false,
  lines = 3, 
  className 
}) => (
  <div className={clsx('space-y-4 p-6 bg-white rounded-2xl border border-gray-200', className)}>
    {withImage && <Skeleton height="12rem" />}
    
    <div className="space-y-3">
      {withAvatar && (
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
          <div className="space-y-2 flex-1">
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="0.75rem" width="30%" />
          </div>
        </div>
      )}
      
      <Skeleton height="1.5rem" width="60%" />
      
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          height="1rem" 
          width={index === lines - 1 ? '80%' : '100%'} 
        />
      ))}
    </div>
  </div>
);

interface SkeletonStatsProps {
  count?: number;
  className?: string;
}

export const SkeletonStats: React.FC<SkeletonStatsProps> = ({ 
  count = 4, 
  className 
}) => (
  <div className={clsx('grid gap-5 sm:grid-cols-2 lg:grid-cols-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3">
        <Skeleton variant="circular" width="3rem" height="3rem" />
        <Skeleton height="1rem" width="60%" />
        <Skeleton height="2rem" width="40%" />
      </div>
    ))}
  </div>
);

interface SkeletonFormProps {
  fields?: number;
  className?: string;
}

export const SkeletonForm: React.FC<SkeletonFormProps> = ({ 
  fields = 5, 
  className 
}) => (
  <div className={clsx('space-y-6', className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton height="1rem" width="30%" />
        <Skeleton height="3rem" />
      </div>
    ))}
    
    <div className="flex justify-end space-x-3 pt-4">
      <Skeleton height="2.5rem" width="5rem" />
      <Skeleton height="2.5rem" width="6rem" />
    </div>
  </div>
);

export default Skeleton;