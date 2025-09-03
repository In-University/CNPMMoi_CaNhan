import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination, Spin, message, Select } from 'antd';
import axios from '../util/axios.customize';
import { Product, type ApiResponse } from '../types/product';

const { Option } = Select;

const ProductsPage: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const pageSize = 10;

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/v1/api/categories') as ApiResponse<any[]>;
            if (res.success) {
                setCategories(res.data);
            }
        } catch (error) {
            message.error('Failed to fetch categories');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `/v1/api/products?page=${currentPage}&limit=${pageSize}`;
            if (selectedCategory !== 'all') {
                url = `/v1/api/products/category/${selectedCategory}?page=${currentPage}&limit=${pageSize}`;
            }
            const res = await axios.get(url) as ApiResponse<Product[]>;
            if (res.success) {
                setProducts(res.data);
                setTotalItems(res.pagination?.totalItems || 0);
            }
        } catch (error) {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Products</h1>
            <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ width: 200, marginBottom: 20 }}
            >
                <Option value="all">All Categories</Option>
                {categories.map(category => (
                    <Option key={category._id} value={category._id}>
                        {category.name}
                    </Option>
                ))}
            </Select>
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
                                        title={product.name}
                                        description={`Price: $${product.price}`}
                                    />
                                    <p>{product.description}</p>
                                    <p>Category: {product.category?.name}</p>
                                    <p>Stock: {product.stock}</p>
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
