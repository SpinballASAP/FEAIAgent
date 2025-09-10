import React from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ValidationErrors } from '@/lib/validation';

interface BaseFieldProps {
  name: string;
  label?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'tel' | 'number' | 'password' | 'url';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
}

interface DateFieldProps extends BaseFieldProps {
  type: 'date' | 'datetime-local';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: string;
  max?: string;
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps | DateFieldProps;

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { name, label, error, touched, disabled, required, helperText, type } = props;

  const commonProps = {
    label: required ? `${label} *` : label,
    error,
    touched,
    disabled,
    helperText,
  };

  if (type === 'select') {
    const { value, onChange, onBlur, options, placeholder } = props as SelectFieldProps;
    return (
      <Select
        {...commonProps}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        options={options}
        placeholder={placeholder}
      />
    );
  }

  if (type === 'textarea') {
    const { value, onChange, onBlur, placeholder, rows = 4 } = props as TextareaFieldProps;
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-800">
            {required ? `${label} *` : label}
          </label>
        )}
        
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : touched
              ? 'border-green-300 focus:border-blue-500 focus:ring-blue-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }

  if (type === 'date' || type === 'datetime-local') {
    const { value, onChange, onBlur, min, max } = props as DateFieldProps;
    return (
      <Input
        {...commonProps}
        type={type}
        value={value}
        onValueChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
      />
    );
  }

  const { value, onChange, onBlur, placeholder, icon } = props as InputFieldProps;
  return (
    <Input
      {...commonProps}
      type={type}
      value={value}
      onValueChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      icon={icon}
    />
  );
};

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => (
  <div className={`space-y-6 ${className}`}>
    {(title || description) && (
      <div className="border-b border-gray-200 pb-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = '',
  align = 'right',
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex items-center gap-3 pt-6 border-t border-gray-200 ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

interface FormErrorSummaryProps {
  errors: ValidationErrors;
  className?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  className = '',
}) => {
  const errorEntries = Object.entries(errors).filter(([_, error]) => error);
  
  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There {errorEntries.length === 1 ? 'is' : 'are'} {errorEntries.length} error{errorEntries.length === 1 ? '' : 's'} with your submission
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {errorEntries.map(([field, error]) => (
                <li key={field}>
                  <span className="font-medium capitalize">{field}:</span> {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormField;