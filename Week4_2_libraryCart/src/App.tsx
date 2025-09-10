import { useState } from 'react'
import { ShoppingCart, CartIcon } from './index'
import type { CartItem } from './index'

function App() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'MacBook Pro 16"',
      price: 2499.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      price: 999.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'AirPods Pro',
      price: 249.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'
    }
  ])

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() }
    setItems([...items, newItem])
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleClearCart = () => {
    setItems([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with CartIcon */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">My Store</h1>
            <CartIcon
              itemCount={items.reduce((sum, item) => sum + item.quantity, 0)}
              size="md"
              onClick={() => console.log('Cart clicked!')}
            />
          </div>
        </div>
      </header>

      <ShoppingCart
        items={items}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  )
}

export default App
