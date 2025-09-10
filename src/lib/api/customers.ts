import { apiClient } from './client';
import type {
  CustomerResponse,
  CustomerCreate,
  CustomerUpdate,
} from '@/types/api';

export const customersApi = {
  // Get all customers
  getCustomers: async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    active_only?: boolean;
  }) => {
    const { data } = await apiClient.get<CustomerResponse[]>('/api/customers/', {
      params,
    });
    return data;
  },

  // Get customer by ID
  getCustomer: async (id: number) => {
    const { data } = await apiClient.get<CustomerResponse>(`/api/customers/${id}`);
    return data;
  },

  // Create new customer
  createCustomer: async (customer: CustomerCreate) => {
    const { data } = await apiClient.post<CustomerResponse>('/api/customers/', customer);
    return data;
  },

  // Update customer
  updateCustomer: async (id: number, customer: CustomerUpdate) => {
    const { data } = await apiClient.put<CustomerResponse>(`/api/customers/${id}`, customer);
    return data;
  },

  // Delete customer
  deleteCustomer: async (id: number, permanent = false) => {
    const { data } = await apiClient.delete(`/api/customers/${id}`, {
      params: { permanent },
    });
    return data;
  },

  // Search customers by phone
  searchByPhone: async (phone: string) => {
    const { data } = await apiClient.get<CustomerResponse[]>(
      `/api/customers/search/by-phone/${phone}`
    );
    return data;
  },

  // Get customer statistics
  getCustomerStats: async (id: number) => {
    const { data } = await apiClient.get(`/api/customers/${id}/stats`);
    return data;
  },
};