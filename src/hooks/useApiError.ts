import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
  details?: Record<string, any>;
}

interface UseApiErrorReturn {
  error: ApiError | null;
  clearError: () => void;
  setError: (error: ApiError | string) => void;
  handleError: (error: unknown) => void;
  isError: boolean;
}

export const useApiError = (showToast: boolean = true): UseApiErrorReturn => {
  const [error, setErrorState] = useState<ApiError | null>(null);
  const { error: showErrorToast } = useToast();

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const setError = useCallback((error: ApiError | string) => {
    const apiError: ApiError = typeof error === 'string' 
      ? { message: error }
      : error;
    
    setErrorState(apiError);
    
    if (showToast) {
      showErrorToast('Error', apiError.message);
    }
  }, [showToast, showErrorToast]);

  const handleError = useCallback((error: unknown) => {
    console.error('API Error:', error);
    
    let apiError: ApiError;
    
    if (error && typeof error === 'object' && 'response' in error) {
      // Axios error
      const axiosError = error as any;
      const response = axiosError.response;
      
      if (response?.data) {
        apiError = {
          message: response.data.message || response.data.error || 'An error occurred',
          status: response.status,
          code: response.data.code,
          field: response.data.field,
          details: response.data.details,
        };
      } else {
        apiError = {
          message: axiosError.message || 'Network error occurred',
          status: response?.status,
        };
      }
    } else if (error instanceof Error) {
      apiError = {
        message: error.message,
      };
    } else if (typeof error === 'string') {
      apiError = {
        message: error,
      };
    } else {
      apiError = {
        message: 'An unexpected error occurred',
      };
    }
    
    setError(apiError);
  }, [setError]);

  return {
    error,
    clearError,
    setError,
    handleError,
    isError: error !== null,
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    return axiosError.response?.data?.message || 
           axiosError.response?.data?.error || 
           axiosError.message || 
           'Network error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    const axiosError = error as any;
    return axiosError.code === 'NETWORK_ERROR' || 
           axiosError.code === 'ECONNREFUSED' ||
           axiosError.message?.includes('Network Error');
  }
  return false;
};

export const isTimeoutError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    const axiosError = error as any;
    return axiosError.code === 'ECONNABORTED' ||
           axiosError.message?.includes('timeout');
  }
  return false;
};

export const getStatusCode = (error: unknown): number | undefined => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    return axiosError.response?.status;
  }
  return undefined;
};

export const isValidationError = (error: unknown): boolean => {
  const status = getStatusCode(error);
  return status === 400 || status === 422;
};

export const isAuthenticationError = (error: unknown): boolean => {
  const status = getStatusCode(error);
  return status === 401;
};

export const isAuthorizationError = (error: unknown): boolean => {
  const status = getStatusCode(error);
  return status === 403;
};

export const isNotFoundError = (error: unknown): boolean => {
  const status = getStatusCode(error);
  return status === 404;
};

export const isServerError = (error: unknown): boolean => {
  const status = getStatusCode(error);
  return status !== undefined && status >= 500;
};