import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  // semantic CSS classes (defined in src/index.css)
  const baseClasses = 'btn';

  const variantClasses: Record<string, string> = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    danger: 'btn--danger',
    success: 'btn--success',
    warning: 'btn--warning'
  };

  const sizeClasses: Record<string, string> = {
    sm: 'btn--sm',
    md: 'btn--md',
    lg: 'btn--lg'
  };

  const widthClass = fullWidth ? 'btn--full' : '';
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="btn__spinner" />
      )}
      {!loading && leftIcon && (
        <span className="btn__left">
          {leftIcon}
        </span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="btn__right">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
