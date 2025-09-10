// Re-export everything from components barrel to provide a single import path
export * from './components';

// Default namespaced export to avoid host-app name collisions.
// Usage: import LibraryCart from 'library-cart'; then use <LibraryCart.Button /> etc.
import * as Components from './components';
import * as Types from './types';

// Ensure consumers importing the library get the component CSS automatically.
// This side-effect import includes `src/index.css` in bundlers like Vite/webpack.
import './index.css';

const LibraryCart = {
	...Components,
	// attach types for TS consumers (not used at runtime)
} as unknown as typeof Components & { types: typeof Types };

export default LibraryCart;
