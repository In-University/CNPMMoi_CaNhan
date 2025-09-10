import React, { useCallback, useEffect, useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Pagination, 
    Spin, 
    message, 
    Select, 
    Input, 
    Space, 
    
    Button, 
    
    Rate, 
    Collapse,
    Tag 
} from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import axios from '../util/axios.customize';
import LibraryCart from '../../../../Week4_2_libraryCart/src';
import { useCart } from '../components/context/cart.context';
import type { Product, ApiResponse, Category } from '../types/product';

const { Option } = Select;
const { Search } = Input;
const { Panel } = Collapse;

interface FilterValues {
    query: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    hasDiscount: string;
    minViews: number;
    minRating: number;
    featured: string;
    inStock: string;
    sortBy: string;
    sortOrder: string;
}

const ProductsPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    // Filter states
    const [filters, setFilters] = useState<FilterValues>({
        query: '',
        category: 'all',
        minPrice: 0,
        maxPrice: 10000,
        hasDiscount: 'all',
        minViews: 0,
        minRating: 0,
        featured: 'all',
        inStock: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    const pageSize = 10;
    // Normalize Elasticsearch results (which may not include nested category) to Product shape

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let url = `/v1/api/products?page=${currentPage}&limit=${pageSize}`;
            
            if (filters.query.trim() || filters.category !== 'all' || filters.hasDiscount !== 'all' || 
                filters.featured !== 'all' || filters.inStock !== 'all' || filters.minPrice > 0 || 
                filters.maxPrice < 10000 || filters.minViews > 0 || filters.minRating > 0) {
                
                const params = new URLSearchParams({ 
                    q: filters.query, 
                    page: String(currentPage), 
                    limit: String(pageSize),
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder
                });
                
                if (filters.category !== 'all') params.set('categoryId', filters.category);
                if (filters.hasDiscount !== 'all') params.set('hasDiscount', filters.hasDiscount);
                if (filters.featured !== 'all') params.set('featured', filters.featured);
                if (filters.inStock !== 'all') params.set('inStock', filters.inStock);
                if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
                if (filters.maxPrice < 10000) params.set('maxPrice', String(filters.maxPrice));
                if (filters.minViews > 0) params.set('minViews', String(filters.minViews));
                if (filters.minRating > 0) params.set('minRating', String(filters.minRating));
                
                url = `/v1/api/products/search?${params.toString()}`;
            }
            
            const res = await axios.get(url) as ApiResponse<unknown[]>;
            if (res.success) {
                const rawList = (res.data || []) as Array<Record<string, unknown>>;
                const list: Product[] = rawList.map((r) => {
                    const category = (r['category'] as { _id: string; name: string } | undefined) || {
                        _id: String(r['categoryId'] ?? ''),
                        name: String(r['categoryName'] ?? '')
                    };
                    return {
                        _id: String(r['_id'] ?? ''),
                        name: String(r['name'] ?? ''),
                        description: String(r['description'] ?? ''),
                        price: Number(r['price'] ?? 0),
                        image: String(r['image'] ?? ''),
                        stock: Number(r['stock'] ?? 0),
                        discount: Number(r['discount'] ?? 0),
                        views: Number(r['views'] ?? 0),
                        rating: Number(r['rating'] ?? 0),
                        featured: Boolean(r['featured'] ?? false),
                        inStock: Boolean(r['inStock'] ?? true),
                        createdAt: String(r['createdAt'] ?? ''),
                        updatedAt: String((r['updatedAt'] as string | undefined) ?? ''),
                        category
                    };
                });
                setProducts(list);
                setTotalItems(res.pagination?.totalItems || 0);
            }
        } catch {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/v1/api/categories') as ApiResponse<Category[]>;
            if (res.success) {
                setCategories(res.data);
            }
        } catch {
            message.error('Failed to fetch categories');
        }
    };

    const handleCategoryChange = (value: string) => {
        setFilters(prev => ({ ...prev, category: value }));
        setCurrentPage(1);
    };

    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, query: value }));
        setCurrentPage(1);
    };

    const handleFilterChange = (key: keyof FilterValues, value: string | number | boolean) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            query: '',
            category: 'all',
            minPrice: 0,
            maxPrice: 10000,
            hasDiscount: 'all',
            minViews: 0,
            minRating: 0,
            featured: 'all',
            inStock: 'all',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const { addItem } = useCart();

    const handleAddToCart = (product: Product) => {
        addItem({ id: product._id, productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.image });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Products</h1>
            
            {/* Basic Search and Category Filter */}
            <Space style={{ marginBottom: 20 }} wrap>
                <Search
                    placeholder="Search products..."
                    allowClear
                    enterButton
                    onSearch={handleSearch}
                    style={{ width: 320 }}
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                />
                <Select
                    value={filters.category}
                    onChange={handleCategoryChange}
                    style={{ width: 200 }}
                >
                    <Option value="all">All Categories</Option>
                    {categories.map(category => (
                        <Option key={category._id} value={category._id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
            </Space>

            {/* Advanced Filters */}
            <Collapse style={{ marginBottom: 20 }}>
                <Panel header={<span><FilterOutlined /> Advanced Filters</span>} key="1">
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <div>
                                <label>Price Range:</label>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input 
                                        type="number" 
                                        placeholder="Min Price" 
                                        value={filters.minPrice || ''} 
                                        onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || 0)}
                                    />
                                    <Input 
                                        type="number" 
                                        placeholder="Max Price" 
                                        value={filters.maxPrice === 10000 ? '' : filters.maxPrice} 
                                        onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 10000)}
                                    />
                                </Space>
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>Has Discount:</label>
                                <Select 
                                    value={filters.hasDiscount} 
                                    onChange={(value) => handleFilterChange('hasDiscount', value)}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">All</Option>
                                    <Option value="true">Yes</Option>
                                    <Option value="false">No</Option>
                                </Select>
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>Minimum Views:</label>
                                <Input 
                                    type="number" 
                                    placeholder="Min Views" 
                                    value={filters.minViews || ''} 
                                    onChange={(e) => handleFilterChange('minViews', Number(e.target.value) || 0)}
                                />
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>Minimum Rating:</label>
                                <Rate 
                                    value={filters.minRating} 
                                    onChange={(value) => handleFilterChange('minRating', value || 0)}
                                />
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>Featured:</label>
                                <Select 
                                    value={filters.featured} 
                                    onChange={(value) => handleFilterChange('featured', value)}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">All</Option>
                                    <Option value="true">Featured Only</Option>
                                    <Option value="false">Not Featured</Option>
                                </Select>
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>In Stock:</label>
                                <Select 
                                    value={filters.inStock} 
                                    onChange={(value) => handleFilterChange('inStock', value)}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">All</Option>
                                    <Option value="true">In Stock</Option>
                                    <Option value="false">Out of Stock</Option>
                                </Select>
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>Sort By:</label>
                                <Select 
                                    value={filters.sortBy} 
                                    onChange={(value) => handleFilterChange('sortBy', value)}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="createdAt">Date Created</Option>
                                    <Option value="price">Price</Option>
                                    <Option value="views">Views</Option>
                                    <Option value="rating">Rating</Option>
                                    <Option value="name">Name</Option>
                                </Select>
                            </div>
                        </Col>
                        
                        <Col span={6}>
                            <div>
                                <label>Sort Order:</label>
                                <Select 
                                    value={filters.sortOrder} 
                                    onChange={(value) => handleFilterChange('sortOrder', value)}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="asc">Ascending</Option>
                                    <Option value="desc">Descending</Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    
                    <div style={{ marginTop: 16 }}>
                        <Button 
                            type="default" 
                            icon={<ClearOutlined />} 
                            onClick={clearFilters}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                </Panel>
            </Collapse>

            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {products.map(product => (
                            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    cover={<img alt={product.name} src={product.image || 'https://via.placeholder.com/300'} />}
                                >
                                    <Card.Meta
                                        title={
                                            <div>
                                                {product.name}
                                                {product.featured && <Tag color="gold" style={{ marginLeft: 8 }}>Featured</Tag>}
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <div>Price: ${product.price}</div>
                                                {product.discount && product.discount > 0 && (
                                                    <Tag color="red">-{product.discount}%</Tag>
                                                )}
                                            </div>
                                        }
                                    />
                                    <p>{product.description}</p>
                                    <p>Category: {product.category?.name}</p>
                                    <p>Stock: {product.stock}</p>
                                    {product.views && <p>Views: {product.views}</p>}
                                    {product.rating && (
                                        <p>Rating: <Rate disabled value={product.rating} /></p>
                                    )}
                                    {!product.inStock && <Tag color="red">Out of Stock</Tag>}
                                    <div style={{ marginTop: 12 }}>
                                        <LibraryCart.Button onClick={() => handleAddToCart(product)}>
                                            Add to Cart
                                        </LibraryCart.Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Pagination
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        style={{ marginTop: 20, textAlign: 'center' }}
                    />
                </>
            )}
        </div>
    );
};

export default ProductsPage;
