import React, { useId } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  touched?: boolean;
  onValueChange?: (value: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    icon, 
    rightIcon, 
    touched,
    onValueChange,
    className, 
    id,
    onChange,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    
    const baseClasses = 'w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : touched
      ? 'border-green-300 focus:border-blue-500 focus:ring-blue-200'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };
    
    const iconPadding = icon ? 'pl-10' : '';
    const rightIconPadding = rightIcon ? 'pr-10' : '';

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-800"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              baseClasses,
              stateClasses,
              iconPadding,
              rightIconPadding,
              className
            )}
            onChange={handleChange}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
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
);

Input.displayName = 'Input';

export default Input;