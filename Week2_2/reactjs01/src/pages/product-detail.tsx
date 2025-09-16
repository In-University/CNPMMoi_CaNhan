import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import ProductDetail from '../components/ProductDetail';
import ProductComments from '../components/ProductComments';
import ProductItem from '../components/ProductItem';
import { getSimilarProductsApi } from '../util/api';
import type { Product, SimilarProduct } from '../types/product';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate('/products');
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) {
            fetchSimilarProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchSimilarProducts = async () => {
        if (!id) return;
        
        try {
            setLoadingSimilar(true);
            const response = await getSimilarProductsApi(id);
            
            if (response.success) {
                // Convert SimilarProduct to Product format
                const convertedProducts: Product[] = response.data.map((item: SimilarProduct) => ({
                    _id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    stock: item.stock,
                    discount: item.discount,
                    views: item.views,
                    purchasedCount: 0, // Not provided in similar products API
                    commentCount: 0,   // Not provided in similar products API
                    favoritedCount: 0, // Not provided in similar products API
                    rating: item.rating,
                    featured: item.featured,
                    inStock: item.inStock,
                    createdAt: item.createdAt,
                    updatedAt: item.createdAt, // Use createdAt as fallback
                    category: {
                        _id: item.categoryId,
                        name: item.categoryName
                    }
                }));
                setSimilarProducts(convertedProducts);
            }
        } catch (err) {
            console.error('Error fetching similar products:', err);
        } finally {
            setLoadingSimilar(false);
        }
    };

    const handleProductLoad = (loadedProduct: Product) => {
        setProduct(loadedProduct);
    };

    const handleCommentAdded = () => {
        // Refresh product data to update comment count
        if (product) {
            setProduct({
                ...product,
                commentCount: (product.commentCount || 0) + 1
            });
        }
    };

    const handleFavoriteChange = (productId: string, favorited: boolean) => {
        // Update similar products favorite count
        setSimilarProducts(prev => prev.map(p => 
            p._id === productId 
                ? { 
                    ...p, 
                    favoritedCount: favorited 
                        ? (p.favoritedCount || 0) + 1
                        : Math.max((p.favoritedCount || 0) - 1, 0)
                  }
                : p
        ));
    };

    if (!id) {
        return <div>Product ID not found</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
                {/* Back Button */}
                <div style={{ marginBottom: '20px' }}>
                    <button 
                        onClick={() => navigate('/products')} 
                        style={{
                            backgroundColor: '#f1f2f6',
                            color: '#333',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ← Quay lại danh sách sản phẩm
                    </button>
                </div>

                {/* Main Product Detail */}
                <div style={{ marginBottom: '40px' }}>
                    <ProductDetail 
                        productId={id} 
                        onProductLoad={handleProductLoad}
                    />
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                            Sản phẩm tương tự
                        </h3>
                        {loadingSimilar ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {similarProducts.map(product => (
                                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                                        <ProductItem 
                                            product={product}
                                            onFavoriteChange={handleFavoriteChange}
                                            showDetailButton={true}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                )}

                {/* Comments Section */}
                <div style={{ marginBottom: '40px' }}>
                    <ProductComments 
                        productId={id}
                        onCommentAdded={handleCommentAdded}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;