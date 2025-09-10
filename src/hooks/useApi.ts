import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { useApiError } from './useApiError';

interface UseApiOptions {
  immediate?: boolean;
  showErrorToast?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, showErrorToast = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const { error, handleError, clearError } = useApiError(showErrorToast);

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setLoading(true);
      clearError();

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, handleError, clearError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specific API hooks for each resource
export function useCustomers() {
  return useApi(
    () => apiClient.get('/customers').then(res => res.data),
    { immediate: true }
  );
}

export function useCustomer(id: number) {
  return useApi(
    () => apiClient.get(`/customers/${id}`).then(res => res.data),
    { immediate: !!id }
  );
}

export function useCreateCustomer() {
  return useApi((customerData: any) =>
    apiClient.post('/customers', customerData).then(res => res.data)
  );
}

export function useUpdateCustomer() {
  return useApi((id: number, customerData: any) =>
    apiClient.put(`/customers/${id}`, customerData).then(res => res.data)
  );
}

export function useDeleteCustomer() {
  return useApi((id: number) =>
    apiClient.delete(`/customers/${id}`).then(res => res.data)
  );
}

export function useVehicles() {
  return useApi(
    () => apiClient.get('/vehicles').then(res => res.data),
    { immediate: true }
  );
}

export function useVehicle(id: number) {
  return useApi(
    () => apiClient.get(`/vehicles/${id}`).then(res => res.data),
    { immediate: !!id }
  );
}

export function useCreateVehicle() {
  return useApi((vehicleData: any) =>
    apiClient.post('/vehicles', vehicleData).then(res => res.data)
  );
}

export function useUpdateVehicle() {
  return useApi((id: number, vehicleData: any) =>
    apiClient.put(`/vehicles/${id}`, vehicleData).then(res => res.data)
  );
}

export function useDeleteVehicle() {
  return useApi((id: number) =>
    apiClient.delete(`/vehicles/${id}`).then(res => res.data)
  );
}

export function useJobs() {
  return useApi(
    () => apiClient.get('/jobs').then(res => res.data),
    { immediate: true }
  );
}

export function useJob(id: number) {
  return useApi(
    () => apiClient.get(`/jobs/${id}`).then(res => res.data),
    { immediate: !!id }
  );
}

export function useCreateJob() {
  return useApi((jobData: any) =>
    apiClient.post('/jobs', jobData).then(res => res.data)
  );
}

export function useUpdateJob() {
  return useApi((id: number, jobData: any) =>
    apiClient.put(`/jobs/${id}`, jobData).then(res => res.data)
  );
}

export function useDeleteJob() {
  return useApi((id: number) =>
    apiClient.delete(`/jobs/${id}`).then(res => res.data)
  );
}

export function useTransportation() {
  return useApi(
    () => apiClient.get('/transportation').then(res => res.data),
    { immediate: true }
  );
}

export function useTransportationRecord(id: number) {
  return useApi(
    () => apiClient.get(`/transportation/${id}`).then(res => res.data),
    { immediate: !!id }
  );
}

export function useCreateTransportation() {
  return useApi((transportationData: any) =>
    apiClient.post('/transportation', transportationData).then(res => res.data)
  );
}

export function useUpdateTransportation() {
  return useApi((id: number, transportationData: any) =>
    apiClient.put(`/transportation/${id}`, transportationData).then(res => res.data)
  );
}

export function useDeleteTransportation() {
  return useApi((id: number) =>
    apiClient.delete(`/transportation/${id}`).then(res => res.data)
  );
}

// Health check hook for API status
export function useHealthCheck() {
  return useApi(
    () => apiClient.get('/health').then(res => res.data),
    { showErrorToast: false }
  );
}