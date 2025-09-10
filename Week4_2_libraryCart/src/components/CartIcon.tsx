import React from 'react';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

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
  const sizeClass = `cart-icon--${size}`;
  const badgeClass = `cart-icon__badge cart-icon__badge--${size}`;

  return (
    <div className={`cart-icon ${className}`}> 
      <button onClick={onClick} className={`cart-icon__button ${onClick ? 'cart-icon__clickable' : ''}`}>
        <ShoppingCartIcon className={sizeClass} />
      </button>
      {itemCount > 0 && (
        <span className={badgeClass}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
