'use client';

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Card from './Card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <Card className="max-w-2xl mx-auto mt-8" variant="bordered">
    <div className="text-center py-8">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
      
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Something went wrong
      </h2>
      
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
          <summary className="cursor-pointer font-semibold text-red-600 mb-2">
            Error Details (Development Only)
          </summary>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      
      <div className="space-x-4">
        <Button onClick={resetError} variant="primary">
          Try Again
        </Button>
        
        <Button 
          onClick={() => window.location.reload()} 
          variant="secondary"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  </Card>
);

interface ErrorAlertProps {
  error: string | Error;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onDismiss, 
  className 
}) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800 mb-1">
            Error
          </p>
          <p className="text-sm text-red-700">
            {errorMessage}
          </p>
        </div>
        
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="!p-1 text-red-400 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

interface RetryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number) => void;
}

interface RetryWrapperState {
  hasError: boolean;
  retryCount: number;
}

export class RetryWrapper extends React.Component<RetryWrapperProps, RetryWrapperState> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: RetryWrapperProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(): RetryWrapperState {
    return { hasError: true, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RetryWrapper caught an error:', error, errorInfo);
    this.scheduleRetry();
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  scheduleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000, onRetry } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.retryTimeout = setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          retryCount: prevState.retryCount + 1,
        }));
        onRetry?.(retryCount + 1);
      }, retryDelay * Math.pow(2, retryCount));
    }
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;