export interface BaseProduct {
  id: string;
  name: string;
  price: number;
}

export interface BaseCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShoppingCartProps<TCartItem extends BaseCartItem = BaseCartItem> {
  items: TCartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onClose?: () => void;
  className?: string;
}

export interface ProductListProps<TProduct extends BaseProduct = BaseProduct, TCartItem extends BaseCartItem = BaseCartItem> {
  products: TProduct[];
  onAddToCart: (product: TProduct) => void;
  cartItems: TCartItem[];
  renderProduct?: (product: TProduct, isInCart: boolean) => React.ReactNode;
  className?: string;
}

// Legacy types for backward compatibility
export interface Product extends BaseProduct {
  image: string;
  description?: string;
  category?: string;
}

export interface CartItem extends BaseCartItem {
  image: string;
}
