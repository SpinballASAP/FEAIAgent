import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'shadow' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    variant = 'default', 
    padding = 'md', 
    rounded = '2xl',
    className, 
    ...props 
  }, ref) => {
    const baseClasses = 'bg-white transition-all duration-200';
    
    const variants = {
      default: 'border border-gray-200/50',
      bordered: 'border-2 border-gray-200',
      shadow: 'shadow-lg border border-gray-200/50',
      elevated: 'shadow-xl border border-gray-200/50 hover:shadow-2xl',
    };
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };
    
    const roundings = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          paddings[padding],
          roundings[rounded],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'border-b border-gray-200 pb-4 mb-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, level = 3, className, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    
    const levelClasses = {
      1: 'text-3xl',
      2: 'text-2xl',
      3: 'text-xl',
      4: 'text-lg',
      5: 'text-base',
      6: 'text-sm',
    };
    
    return React.createElement(
      Component,
      {
        ref,
        className: clsx(
          'font-bold text-gray-800',
          levelClasses[level],
          className
        ),
        ...props,
      },
      children
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('text-gray-600', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'border-t border-gray-200 pt-4 mt-6 flex items-center justify-end gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;