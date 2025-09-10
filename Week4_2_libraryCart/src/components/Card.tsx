import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick
}) => {
  const baseClasses = 'card';

  const variantClasses: Record<string, string> = {
    default: 'card--default',
    elevated: 'card--elevated',
    outlined: 'card--outlined',
    glass: 'card--glass'
  };

  const paddingClasses: Record<string, string> = {
    none: 'card--p-none',
    sm: 'card--p-sm',
    md: 'card--p-md',
    lg: 'card--p-lg'
  };

  const hoverClasses = hover || clickable ? 'card--hover' : '';
  const clickableClasses = clickable ? 'card--clickable' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`;

  if (clickable || onClick) {
    return (
      <div 
        className={combinedClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card;
