import React from 'react';
import type { Product } from '../types/product';

interface ProductStatsProps {
    product: Product;
    className?: string;
}

// Simple compact stats for product cards
export const ProductStatsCompact: React.FC<ProductStatsProps> = ({ product, className = '' }) => {
    return (
        <div className={`product-stats-simple ${className}`} style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap',
            fontSize: '12px',
            color: '#666',
            marginTop: '8px'
        }}>
            {product.views && product.views > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    👁️ {product.views}
                </span>
            )}
            
            {product.purchasedCount && product.purchasedCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    🛒 {product.purchasedCount}
                </span>
            )}
            
            {product.commentCount && product.commentCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    💬 {product.commentCount}
                </span>
            )}
            
            {product.favoritedCount && product.favoritedCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    ❤️ {product.favoritedCount}
                </span>
            )}
        </div>
    );
};

// Default export - simple stats
const ProductStats: React.FC<ProductStatsProps> = ({ product, className = '' }) => {
    return <ProductStatsCompact product={product} className={className} />;
};

export default ProductStats;