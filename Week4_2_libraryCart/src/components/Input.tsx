import React from 'react';

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
  
  const stateClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400';
    
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
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
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
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
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
