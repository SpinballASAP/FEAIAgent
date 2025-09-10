export type ValidationRule<T = any> = {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: T) => string | null;
};

export type ValidationSchema = {
  [key: string]: ValidationRule;
};

export type ValidationErrors = {
  [key: string]: string;
};

export const validateField = (value: any, rule: ValidationRule): string | null => {
  if (rule.required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }
  
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
    return `Value must be at least ${rule.min}`;
  }
  
  if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
    return `Value must be at most ${rule.max}`;
  }
  
  if (rule.minLength !== undefined && typeof value === 'string' && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }
  
  if (rule.maxLength !== undefined && typeof value === 'string' && value.length > rule.maxLength) {
    return `Must be at most ${rule.maxLength} characters`;
  }
  
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return 'Invalid format';
  }
  
  if (rule.email && typeof value === 'string') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return 'Invalid email format';
    }
  }
  
  if (rule.phone && typeof value === 'string') {
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Invalid phone number format';
    }
  }
  
  if (rule.url && typeof value === 'string') {
    try {
      new URL(value);
    } catch {
      return 'Invalid URL format';
    }
  }
  
  if (rule.custom) {
    return rule.custom(value);
  }
  
  return null;
};

export const validateForm = (data: any, schema: ValidationSchema): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field];
    const error = validateField(value, rule);
    
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFieldError = (errors: ValidationErrors, field: string): string | undefined => {
  return errors[field];
};

export const setFieldError = (
  errors: ValidationErrors,
  field: string,
  error: string | null
): ValidationErrors => {
  if (error) {
    return { ...errors, [field]: error };
  } else {
    const { [field]: _, ...rest } = errors;
    return rest;
  }
};

export const clearFieldError = (errors: ValidationErrors, field: string): ValidationErrors => {
  const { [field]: _, ...rest } = errors;
  return rest;
};

export const clearAllErrors = (): ValidationErrors => {
  return {};
};

export const customerValidationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    email: true,
  },
  phone: {
    required: true,
    phone: true,
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  creditLimit: {
    min: 0,
  },
};

export const vehicleValidationSchema: ValidationSchema = {
  licensePlate: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[A-Z0-9\-\s]+$/i,
  },
  type: {
    required: true,
  },
  capacity: {
    required: true,
    min: 1,
    max: 100000,
  },
  fuelType: {
    required: true,
  },
  year: {
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  driverId: {
    required: true,
  },
};

export const jobValidationSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    maxLength: 1000,
  },
  customerId: {
    required: true,
  },
  pickupAddress: {
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  deliveryAddress: {
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  weight: {
    min: 0.1,
    max: 100000,
  },
  value: {
    min: 0,
  },
  priority: {
    required: true,
  },
};

export const transportationValidationSchema: ValidationSchema = {
  jobId: {
    required: true,
  },
  vehicleId: {
    required: true,
  },
  driverId: {
    required: true,
  },
  startDate: {
    required: true,
  },
  distance: {
    min: 0.1,
  },
  fuelCost: {
    min: 0,
  },
  tollCost: {
    min: 0,
  },
  otherCosts: {
    min: 0,
  },
};