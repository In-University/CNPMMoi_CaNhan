import React from 'react';
import LibraryCart from '../../../../Week4_2_libraryCart/src';
import { useCart } from '../components/context/cart.context';
import './cart.css';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clear } = useCart();

  const onUpdateQuantity = (id: string, qty: number) => {
    updateQuantity(id, qty);
  };

  return (
    <div className="cart-page" style={{ padding: 20 }}>
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-page-card">
        <LibraryCart.ShoppingCart
          items={items as any}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clear}
          onClose={() => { }}
          className="shopping-cart-embedded"
        />
      </div>
    </div>
  );
};

export default CartPage;
 