# LibraryCart - Quick Guide

This file provides a short guide to integrating the cart UI components from `src/components` into a React + Vite project.

## Purpose

Provide basic cart UI building blocks: `ShoppingCart` (item list, quantity updates, remove), `CartIcon` (cart icon with badge), and other utility components (`Button`, `Card`, etc.).

## Requirements

- A React + Vite project
- Node and a package manager (pnpm/npm/yarn)
- Dependencies used by the components (if not present): `react`, `react-dom`, `lucide-react` for icons. If you use Tailwind CSS, keep your CSS setup consistent.

Install example (pnpm):

```bash
pnpm install react react-dom lucide-react
```

## Data shape (basic)

`ShoppingCart` expects items similar to a `BaseCartItem`:

- `id: string`
- `name: string`
- `price: number`
- `quantity: number`

## Integration

1. Import the components from `src/components`:

```tsx
import { ShoppingCart, CartIcon } from './src/components';
```

2. Simple `CartIcon` example:

```tsx
<CartIcon itemCount={items.length} size="md" onClick={() => setOpen(true)} />
```

3. Minimal `ShoppingCart` example:

```tsx
const items = [
  { id: 'p1', name: 'Product 1', price: 9.99, quantity: 2 },
  { id: 'p2', name: 'Product 2', price: 5.5, quantity: 1 }
];

<ShoppingCart
  items={items}
  onUpdateQuantity={(id, qty) => { /* update state */ }}
  onRemoveItem={(id) => { /* remove item */ }}
  onClearCart={() => { /* clear cart */ }}
  onClose={() => setOpen(false)}
  className="" // optional
/>
```

Main `ShoppingCart` props (summary):

- `items`: array of cart items
- `onUpdateQuantity(id, newQty)`: called when quantity changes
- `onRemoveItem(id)`: remove a single item
- `onClearCart()`: clear all items
- `onClose()`: close/hide the cart

## Styling notes

Components use className hooks and should work with Tailwind or plain CSS. If you use Tailwind, ensure your `index.css`/`App.css` imports Tailwind directives.

## Run locally

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`

--

If you want, I can add a full example wrapper component, an English + Vietnamese README, or specific Tailwind installation steps.
