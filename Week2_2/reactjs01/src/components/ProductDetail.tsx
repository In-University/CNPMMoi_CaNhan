import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './context/auth.context';
import type { Product } from '../types/product';
import { getProductDetailApi, postProductViewApi, toggleFavoriteApi } from '../util/api';
import '../styles/product-components.css';

interface ProductDetailProps {
    productId: string;
    onProductLoad?: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onProductLoad }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
    const [isFavorited, setIsFavorited] = useState<boolean>(false);
    
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getProductDetailApi(productId);
                
                if (response.success) {
                    setProduct(response.data);
                    if (onProductLoad) {
                        onProductLoad(response.data);
                    }
                } else {
                    setError('Không thể tải thông tin sản phẩm');
                }
            } catch (err: unknown) {
                console.error('Error fetching product:', err);
                const errorMessage = err && typeof err === 'object' && 'response' in err && 
                    err.response && typeof err.response === 'object' && 'data' in err.response &&
                    err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
                    ? (err.response.data as { message: string }).message 
                    : 'Có lỗi xảy ra khi tải sản phẩm';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]); // Only depend on productId to prevent infinite loop

    const handleViewIncrement = async () => {
        try {
            await postProductViewApi(productId);
            // Optionally update the local views count
            if (product) {
                setProduct({
                    ...product,
                    views: (product.views || 0) + 1
                });
            }
        } catch (err) {
            console.error('Error incrementing view:', err);
        }
    };

    const handleToggleFavorite = async () => {
        if (!user) {
            alert('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }

        try {
            setFavoriteLoading(true);
            const response = await toggleFavoriteApi(productId);
            
            if (response.success) {
                setIsFavorited(response.data.favorited);
                // Update favorite count in product
                if (product) {
                    const newCount = response.data.favorited 
                        ? (product.favoritedCount || 0) + 1
                        : Math.max((product.favoritedCount || 0) - 1, 0);
                    
                    setProduct({
                        ...product,
                        favoritedCount: newCount
                    });
                }
            }
        } catch (err: unknown) {
            console.error('Error toggling favorite:', err);
            const errorMessage = err && typeof err === 'object' && 'response' in err && 
                err.response && typeof err.response === 'object' && 'data' in err.response &&
                err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
                ? (err.response.data as { message: string }).message 
                : 'Có lỗi xảy ra';
            alert(errorMessage);
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="loading-spinner">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail-error">
                <p className="error-message">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="retry-button"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-error">
                <p>Không tìm thấy sản phẩm</p>
            </div>
        );
    }

    return (
        <div className="product-detail">
            <div className="product-detail-container">
                <div className="product-image-section">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onLoad={handleViewIncrement}
                    />
                </div>
                
                <div className="product-info-section">
                    <div className="product-header">
                        <h1 className="product-title">{product.name}</h1>
                        <button 
                            onClick={handleToggleFavorite}
                            disabled={favoriteLoading}
                            className={`favorite-button ${isFavorited ? 'favorited' : ''} ${favoriteLoading ? 'loading' : ''}`}
                            title={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                        >
                            <span className="heart-icon">
                                {isFavorited ? '❤️' : '🤍'}
                            </span>
                            {favoriteLoading && <span className="loading-text">...</span>}
                        </button>
                    </div>

                    <div className="product-stats">
                        <div className="stat-item">
                            <span className="stat-icon">👁️</span>
                            <span className="stat-label">Lượt xem:</span>
                            <span className="stat-value">{product.views || 0}</span>
                        </div>
                        
                        <div className="stat-item">
                            <span className="stat-icon">🛒</span>
                            <span className="stat-label">Đã mua:</span>
                            <span className="stat-value">{product.purchasedCount || 0}</span>
                        </div>
                        
                        <div className="stat-item">
                            <span className="stat-icon">💬</span>
                            <span className="stat-label">Bình luận:</span>
                            <span className="stat-value">{product.commentCount || 0}</span>
                        </div>
                        
                        <div className="stat-item">
                            <span className="stat-icon">❤️</span>
                            <span className="stat-label">Yêu thích:</span>
                            <span className="stat-value">{product.favoritedCount || 0}</span>
                        </div>
                    </div>

                    <div className="product-details">
                        <p className="product-description">{product.description}</p>
                        
                        <div className="product-meta">
                            <div className="price-section">
                                <span className="current-price">${product.price}</span>
                                {product.discount && product.discount > 0 && (
                                    <span className="discount">-{product.discount}%</span>
                                )}
                            </div>
                            
                            <div className="stock-section">
                                <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.inStock ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                                </span>
                            </div>
                            
                            {product.rating && (
                                <div className="rating-section">
                                    <span className="rating">⭐ {product.rating.toFixed(1)}</span>
                                </div>
                            )}
                            
                            <div className="category-section">
                                <span className="category">Danh mục: {product.category.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="product-actions">
                        <button 
                            className="add-to-cart-button"
                            disabled={!product.inStock}
                        >
                            {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                        </button>
                        
                        <button 
                            className="buy-now-button"
                            disabled={!product.inStock}
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;