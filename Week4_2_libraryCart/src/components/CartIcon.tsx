import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartIconProps {
  itemCount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({
  itemCount,
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const badgeSizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={onClick}
        className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <ShoppingCart className={sizeClasses[size]} />
      </button>
      {itemCount > 0 && (
        <span className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full ${badgeSizeClasses[size]} font-medium min-w-[1.25rem] text-center`}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
