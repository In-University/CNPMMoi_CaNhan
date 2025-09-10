# Library Cart - React Shopping Cart Components

A modern, developer-friendly React library for building beautiful shopping cart experiences with TypeScript support and TailwindCSS styling.

## 🚀 Quick Start

```bash
npm install library-cart
```

```tsx
import { Button, ShoppingCart, CartItem } from 'library-cart';

function MyApp() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add item to cart - this is where you handle your business logic
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.productId === product.id);

    if (existingItem) {
      // Update quantity if item already exists
      updateCartItem(existingItem.id, { quantity: existingItem.quantity + 1 });
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div>
      {/* Your product list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <h3 className="font-semibold mt-2">{product.name}</h3>
            <p className="text-green-600 font-bold">${product.price}</p>
            <Button
              onClick={() => addToCart(product)}
              className="w-full mt-2"
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>

      {/* Cart trigger button */}
      <Button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-4 right-4 z-10"
      >
        Cart ({cartItems.length})
      </Button>

      {/* Full-screen cart */}
      {isCartOpen && (
        <ShoppingCart
          items={cartItems}
          onUpdateQuantity={(id, quantity) => updateCartItem(id, { quantity })}
          onRemoveItem={removeCartItem}
          onClearCart={() => setCartItems([])}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
```

## 📦 What's Included

### Core Components

- **Button** - Versatile button component with multiple variants
- **ShoppingCart** - Full-screen cart with complete CRUD operations
- **Input** - Enhanced input field with validation
- **Card** - Flexible card component
- **Modal** - Accessible modal with keyboard navigation
- **CartIcon** - Cart icon with item count badge

### Key Features

✨ **Developer Experience First**
- Full TypeScript support with IntelliSense
- Comprehensive documentation and examples
- Flexible API design for easy integration

🎯 **Production Ready**
- Built with modern React patterns
- Optimized performance
- Accessible components (WCAG 2.1 AA)
- Mobile-first responsive design

🎨 **Beautiful by Default**
- TailwindCSS powered styling
- Glass morphism effects
- Smooth animations and transitions
- Customizable themes

## 🛠️ Developer Guide

### 1. Installation & Setup

```bash
# Install the library
npm install library-cart

# Install peer dependencies
npm install react react-dom

# Install TailwindCSS (if not already installed)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. TailwindCSS Configuration

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/library-cart/**/*.{js,ts,jsx,tsx}", // Important!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to your CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Basic Integration Pattern

```tsx
import { Button, ShoppingCart, CartItem } from 'library-cart';

function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart();

  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Button
        onClick={() => addToCart(product)}
        variant="primary"
        className="w-full"
      >
        Add to Cart
      </Button>
    </div>
  );
}

function CartManager() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Cart ({items.length})
      </Button>

      {isCartOpen && (
        <ShoppingCart
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
}
```

## 🎯 Component APIs

### Button

```tsx
<Button
  variant="primary" | "secondary" | "danger" | "success" | "warning"
  size="sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
  leftIcon={ReactNode}
  rightIcon={ReactNode}
  fullWidth={boolean}
  onClick={() => void}
  className="custom-classes"
>
  Button Text
</Button>
```

### ShoppingCart

```tsx
<ShoppingCart
  items={CartItem[]}
  onUpdateQuantity={(id: string, quantity: number) => void}
  onRemoveItem={(id: string) => void}
  onClearCart={() => void}
  onClose={() => void} // Optional
  className="custom-classes" // Optional
/>
```

### CartItem Interface

```tsx
interface CartItem {
  id: string;           // Unique cart item ID
  productId: string;    // Original product ID
  name: string;         // Product name
  price: number;        // Unit price
  quantity: number;     // Quantity in cart
  image?: string;       // Product image URL
}
```

## 🔧 Advanced Usage Patterns

### Custom Cart Hook

```tsx
function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product) => {
    const existing = items.find(item => item.productId === product.id);

    if (existing) {
      updateQuantity(existing.id, existing.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };
      setItems([...items, newItem]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  };
}
```

### Integration with State Management

```tsx
// Redux
const addToCart = (product: Product) => {
  dispatch({
    type: 'ADD_TO_CART',
    payload: {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }
  });
};

// Zustand
const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product) => set(state => {
    const existing = state.items.find(item => item.productId === product.id);
    if (existing) {
      return {
        items: state.items.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return {
      items: [...state.items, {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]
    };
  })
}));
```

### Custom Styling

```tsx
// Override component styles
<ShoppingCart
  className="bg-blue-50 border-blue-200"
  // ... other props
/>

// Custom button variants
<Button
  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
>
  Custom Styled Button
</Button>
```

## 🎨 Theming & Customization

### CSS Variables

The library uses CSS custom properties for theming:

```css
:root {
  --library-cart-primary: #3b82f6;
  --library-cart-secondary: #6b7280;
  --library-cart-success: #10b981;
  --library-cart-danger: #ef4444;
  --library-cart-warning: #f59e0b;
}
```

### Dark Mode Support

```tsx
// Add dark mode classes to your root element
<div className="dark">
  <ShoppingCart />
</div>
```

## 📱 Responsive Design

All components are mobile-first and responsive:

- **Mobile**: Single column layout, full-width buttons
- **Tablet**: 2-column grids, adjusted spacing
- **Desktop**: Multi-column layouts, hover effects

## 🔍 Best Practices

### 1. Cart State Management

```tsx
// ✅ Good: Centralized cart logic
const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    // Business logic here
  };

  return (
    <CartContext.Provider value={{ items, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ❌ Avoid: Scattered cart logic
const ProductCard = ({ product }) => {
  const [cartItems, setCartItems] = useState([]); // Don't do this
};
```

### 2. Error Handling

```tsx
const addToCart = async (product) => {
  try {
    // Validate product
    if (!product.id || !product.price) {
      throw new Error('Invalid product data');
    }

    // Add to cart
    const newItem = createCartItem(product);
    setCartItems([...cartItems, newItem]);

    // Optional: Send to analytics
    trackEvent('add_to_cart', { productId: product.id });

  } catch (error) {
    console.error('Failed to add item to cart:', error);
    // Show user-friendly error message
  }
};
```

### 3. Performance Optimization

```tsx
// ✅ Good: Memoize expensive calculations
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [items]);

// ✅ Good: Debounce quantity updates
const debouncedUpdate = useCallback(
  debounce((id, quantity) => updateQuantity(id, quantity), 300),
  []
);
```

## 🐛 Troubleshooting

### Common Issues

**TailwindCSS classes not working?**
- Make sure to add `./node_modules/library-cart/**/*.{js,ts,jsx,tsx}` to your `tailwind.config.js` content array

**TypeScript errors?**
- Ensure you're using React 18+ and React-DOM 18+
- Check that your CartItem interface matches the library's expectations

**Styling conflicts?**
- The library uses TailwindCSS utility classes
- Use the `className` prop to override styles
- Consider using CSS modules or styled-components for isolation

## 📄 License

MIT License - feel free to use this library in your commercial projects!

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📞 Support

- 📧 Email: support@library-cart.dev
- 💬 Discord: [Join our community](https://discord.gg/library-cart)
- 🐛 Issues: [GitHub Issues](https://github.com/library-cart/issues)

---

**Happy coding! 🎉**
