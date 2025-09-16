import React, { useState, useContext } from 'react';
import { Card, Button, Tag, Rate } from 'antd';
import { EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/auth.context.jsx';
import { useCart } from './context/cart.context';
import { ProductStatsCompact } from './ProductStats';
import { toggleFavoriteApi } from '../util/api';
import type { Product } from '../types/product';

interface ProductItemProps {
    product: Product;
    onFavoriteChange?: (productId: string, favorited: boolean) => void;
    showDetailButton?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ 
    product, 
    onFavoriteChange,
    showDetailButton = true 
}) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { addItem } = useCart();
    
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    // Initialize from product.favoritedCount (presence indicates favorited by current user is not directly available)
    // If backend later provides an explicit `isFavorited` field, prefer that. For now derive false and allow parent to control count.
    // product may include `isFavorited` from backend
    const [isFavorited, setIsFavorited] = useState<boolean>(() => !!(product as unknown as { isFavorited?: boolean }).isFavorited);

    // Keep local favorite state in sync if parent/product changes (e.g., after toggling in detail view)
    React.useEffect(() => {
        const p = product as unknown as { isFavorited?: boolean };
        if (typeof p.isFavorited !== 'undefined') {
            setIsFavorited(!!p.isFavorited);
        }
    }, [product]);

    const handleViewProductDetail = () => {
        navigate(`/products/${product._id}`);
    };

    const handleAddToCart = () => {
        addItem({ 
            id: product._id, 
            productId: product._id, 
            name: product.name, 
            price: product.price, 
            quantity: 1, 
            image: product.image 
        });
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!auth.isAuthenticated) {
            alert('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }

        try {
            setFavoriteLoading(true);
            const response = await toggleFavoriteApi(product._id);
            
            if (response.success) {
                const newFavoriteState = typeof response.data.isFavorited !== 'undefined' ? !!response.data.isFavorited : !!(response.data.favorited);
                setIsFavorited(newFavoriteState);
                // optionally update parent with new state
                onFavoriteChange?.(product._id, newFavoriteState);
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

    return (
        <Card
            hoverable
            style={{ 
                height: 'auto', 
                minHeight: '450px',
                position: 'relative'
            }}
            cover={
                <div style={{ position: 'relative' }}>
                    <img 
                        alt={product.name} 
                        src={product.image || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                    />
                    {/* Favorite button at top right */}
                    <Button
                        type="text"
                        icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                        loading={favoriteLoading}
                        onClick={handleToggleFavorite}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                </div>
            }
            actions={showDetailButton ? [
                <Button 
                    key="view" 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={handleViewProductDetail}
                >
                    Xem chi tiết
                </Button>,
                <Button 
                    key="cart"
                    type="primary"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                >
                    {product.inStock ? 'Thêm giỏ hàng' : 'Hết hàng'}
                </Button>
            ] : [
                <Button 
                    key="cart"
                    type="primary"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                >
                    {product.inStock ? 'Thêm giỏ hàng' : 'Hết hàng'}
                </Button>
            ]}
        >
            <Card.Meta
                title={
                    <div>
                        {product.name}
                        {product.featured && <Tag color="gold" style={{ marginLeft: 8 }}>Nổi bật</Tag>}
                    </div>
                }
                description={
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                            ${product.price}
                        </div>
                        {product.discount && product.discount > 0 && (
                            <Tag color="red">-{product.discount}%</Tag>
                        )}
                    </div>
                }
            />
            
            <div style={{ margin: '12px 0' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    {product.description.length > 80 
                        ? `${product.description.substring(0, 80)}...` 
                        : product.description
                    }
                </p>
                
                <p style={{ marginBottom: '4px' }}>
                    <strong>Danh mục:</strong> {product.category?.name}
                </p>
                
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ marginRight: '16px' }}>
                        <strong>Kho:</strong> {product.stock}
                    </span>
                    {!product.inStock && <Tag color="red">Hết hàng</Tag>}
                </div>

                {/* Product Stats */}
                <ProductStatsCompact product={product} />
                
                {product.rating && (
                    <div style={{ marginTop: '8px' }}>
                        <Rate disabled value={product.rating} style={{ fontSize: '14px' }} />
                        <span style={{ marginLeft: '8px', fontSize: '12px' }}>
                            ({product.rating.toFixed(1)})
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ProductItem;