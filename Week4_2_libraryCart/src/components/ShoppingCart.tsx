import type { ShoppingCartProps, BaseCartItem } from '../types';
import Button from './Button';
import Card from './Card';
import CartIcon from './CartIcon';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';

const ShoppingCart = <TCartItem extends BaseCartItem = BaseCartItem>({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
  className = ''
}: ShoppingCartProps<TCartItem>) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <div className={`shopping-cart-root ${className}`}>
      {/* Header */}
      {/* <div className="shopping-cart-header">
        <div className="shopping-cart-header__left">
          <Button variant="secondary" size="sm" onClick={onClose} className="btn--icon">
            <ArrowLeft className="icon-small" />
          </Button>
          <div className="shopping-cart-header__title">
            <h1>Cart</h1>
            <CartIcon itemCount={items.length} size="sm" />
          </div>
        </div>
        <div className="shopping-cart-header__right">
          <Button variant="danger" onClick={onClearCart} disabled={items.length === 0} size="sm">Clear All</Button>
        </div>
      </div> */}

      {/* Cart Items */}
      <div className="shopping-cart-body">
        <div className="shopping-cart-list">
          {items.length === 0 ? (
            <Card variant="elevated" className="shopping-cart-empty">
              <div className="shopping-cart-empty__inner">
                <div className="shopping-cart-empty__icon">
                  <svg className="icon-large" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <div className="shopping-cart-empty__text">
                  <h3>Your cart is empty</h3>
                  <p>Add some items to get started</p>
                </div>
              </div>
            </Card>
          ) : (
            items.map(item => (
              <Card key={item.id} variant="elevated" hover className="shopping-cart-item">
                <div className="shopping-cart-item__inner">
                  <div className="shopping-cart-item__info">
                    <h3 className="shopping-cart-item__name">{item.name}</h3>
                    <div className="shopping-cart-item__meta">
                      <div>
                        <span>Price:</span>
                        <strong>${item.price.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>Quantity:</span>
                        <div className="shopping-cart-item__qty">
                          <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} variant="secondary" size="sm" disabled={item.quantity <= 1}><Minus className="icon-small" /></Button>
                          <span className="shopping-cart-item__qty-value">{item.quantity}</span>
                          <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} variant="secondary" size="sm"><Plus className="icon-small" /></Button>
                        </div>
                      </div>
                      <div>
                        <span>Subtotal:</span>
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="shopping-cart-item__actions">
                    <Button variant="danger" onClick={() => onRemoveItem(item.id)} size="sm">
                      <Trash2 className="icon-small" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Total - Sticky Footer */}
      {items.length > 0 && (
        <div className="shopping-cart-footer">
          <div className="shopping-cart-footer__inner">
            <div>
              <p>Total Amount</p>
              <p className="shopping-cart-footer__total">${total.toFixed(2)}</p>
            </div>
            <Button variant="success" size="lg" className="shopping-cart-footer__button">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;