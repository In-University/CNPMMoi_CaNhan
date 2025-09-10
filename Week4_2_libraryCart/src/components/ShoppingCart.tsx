import type { ShoppingCartProps, BaseCartItem } from '../types';
import Button from './Button';
import Card from './Card';
import CartIcon from './CartIcon';

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
    <div className={`fixed inset-0 w-full h-full bg-gray-50 overflow-auto z-50 ${className}`}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="p-1.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">Cart</h1>
              <CartIcon itemCount={items.length} size="sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={onClearCart}
              disabled={items.length === 0}
              size="sm"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-6">
        <div className="grid gap-6 mb-8">
          {items.length === 0 ? (
            <Card variant="elevated" className="text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="text-gray-300">
                  <svg className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some items to get started</p>
                </div>
              </div>
            </Card>
          ) : (
            items.map(item => (
              <Card key={item.id} variant="elevated" hover className="overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            variant="secondary"
                            size="sm"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="font-semibold text-blue-600 min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            variant="secondary"
                            size="sm"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-bold text-purple-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      onClick={() => onRemoveItem(item.id)}
                      size="sm"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
            </div>
            <Button variant="success" size="lg" className="w-full md:w-auto px-8 py-3">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;