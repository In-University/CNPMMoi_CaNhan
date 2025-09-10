import React from 'react';
import { Info as InfoIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  hint, 
  leftIcon, 
  rightIcon, 
  fullWidth = true, 
  className = '',
  ...props 
}) => {
  const inputId = React.useId();
  
  const baseInputClasses = 'block w-full px-4 py-3 text-gray-900 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const stateClasses = error ? 'input--error' : 'input--default';
    
  const iconPaddingClasses = leftIcon && rightIcon 
    ? 'pl-12 pr-12' 
    : leftIcon 
    ? 'pl-12' 
    : rightIcon 
    ? 'pr-12' 
    : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="input__label"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="input__left-icon">
            <div>
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={`${baseInputClasses} ${stateClasses} ${iconPaddingClasses}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="input__right-icon">
            <div>
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <InfoIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
