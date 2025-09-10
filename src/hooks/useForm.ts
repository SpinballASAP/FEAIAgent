import { useState, useCallback, useEffect } from 'react';
import { ValidationSchema, ValidationErrors, validateForm, validateField, hasErrors } from '@/lib/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: ValidationErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setValues: (values: T) => void;
  setErrors: (errors: ValidationErrors) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<ValidationErrors>({});
  const [touched, setTouchedState] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = !hasErrors(errors);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value,
    }));

    if (validateOnChange && validationSchema?.[field as string]) {
      const error = validateField(value, validationSchema[field as string]);
      setErrorsState(prev => ({
        ...prev,
        [field]: error || undefined,
      }));
    }
  }, [validateOnChange, validationSchema]);

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrorsState(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, []);

  const setValues = useCallback((newValues: T) => {
    setValuesState(newValues);
  }, []);

  const setErrors = useCallback((newErrors: ValidationErrors) => {
    setErrorsState(newErrors);
  }, []);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setFieldValue(field, value);
  }, [setFieldValue]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouchedState(prev => ({
      ...prev,
      [field]: true,
    }));

    if (validateOnBlur && validationSchema?.[field as string]) {
      const error = validateField(values[field], validationSchema[field as string]);
      setErrorsState(prev => ({
        ...prev,
        [field]: error || undefined,
      }));
    }
  }, [validateOnBlur, validationSchema, values]);

  const validateFormFields = useCallback(() => {
    if (!validationSchema) return true;

    const formErrors = validateForm(values, validationSchema);
    setErrorsState(formErrors);
    
    return !hasErrors(formErrors);
  }, [values, validationSchema]);

  const validateSingleField = useCallback((field: keyof T) => {
    if (!validationSchema?.[field as string]) return;

    const error = validateField(values[field], validationSchema[field as string]);
    setErrorsState(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const isValidForm = validateFormFields();
    
    if (!isValidForm || !onSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateFormFields, onSubmit, values]);

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrorsState({});
    setTouchedState({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    resetForm,
    validateField: validateSingleField,
    validateForm: validateFormFields,
  };
};