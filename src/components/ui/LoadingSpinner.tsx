import React from 'react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  const colors = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <svg 
      className={clsx(
        'animate-spin',
        sizes[size],
        colors[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Full page loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = 'กำลังโหลด...', 
  className 
}) => {
  if (!isLoading) return null;
  
  return (
    <div className={clsx(
      'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size="xl" />
        {message && (
          <p className="mt-4 text-gray-600 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

// Inline loading state for components
interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  isLoading, 
  children, 
  fallback,
  className 
}) => {
  if (isLoading) {
    return (
      <div className={clsx('flex items-center justify-center py-8', className)}>
        {fallback || (
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-gray-600">กำลังโหลด...</p>
          </div>
        )}
      </div>
    );
  }
  
  return <>{children}</>;
};

export default LoadingSpinner;