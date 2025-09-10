// API Response Types
export interface CustomerResponse {
  id: number;
  name: string;
  phone: string;
  address?: string;
  company?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  phone: string;
  address?: string;
  company?: string;
}

export interface CustomerUpdate {
  name?: string;
  phone?: string;
  address?: string;
  company?: string;
  is_active?: boolean;
}

export interface VehicleResponse {
  id: number;
  license_plate: string;
  vehicle_type: VehicleType;
  brand?: string;
  model?: string;
  status: VehicleStatus;
  driver_name?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreate {
  license_plate: string;
  vehicle_type: VehicleType;
  brand?: string;
  model?: string;
  driver_name?: string;
}

export interface VehicleUpdate {
  license_plate?: string;
  vehicle_type?: VehicleType;
  brand?: string;
  model?: string;
  status?: VehicleStatus;
  driver_name?: string;
}

export interface JobResponse {
  id: number;
  job_number: string;
  customer_id: number;
  customer?: CustomerResponse;
  description?: string;
  status: JobStatus;
  priority: JobPriority;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface JobCreate {
  customer_id: number;
  description?: string;
  priority?: JobPriority;
}

export interface JobUpdate {
  customer_id?: number;
  description?: string;
  status?: JobStatus;
  priority?: JobPriority;
}

export interface TransportationResponse {
  id: number;
  job_id: number;
  job?: JobResponse;
  vehicle_id: number;
  vehicle?: VehicleResponse;
  from_location: string;
  to_location: string;
  distance_km: number;
  transport_cost: number;
  start_time: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportationCreate {
  job_id: number;
  vehicle_id: number;
  from_location: string;
  to_location: string;
  distance_km: number;
  transport_cost: number;
  start_time: string;
  end_time?: string;
}

export interface TransportationUpdate {
  job_id?: number;
  vehicle_id?: number;
  from_location?: string;
  to_location?: string;
  distance_km?: number;
  transport_cost?: number;
  start_time?: string;
  end_time?: string;
}

// Enums
export enum VehicleType {
  TRUCK = "truck",
  VAN = "van", 
  MOTORCYCLE = "motorcycle",
  CAR = "car"
}

export enum VehicleStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  MAINTENANCE = "maintenance",
  OUT_OF_SERVICE = "out_of_service"
}

export enum JobStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress", 
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum JobPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  detail: string;
}