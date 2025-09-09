const express = require('express');
const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const { getCategories, getProductsByCategory, getAllProducts } = require('../controllers/productController');
const { searchProducts } = require('../services/searchService');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);

routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);

// Product routes
routerAPI.get("/categories", getCategories);
routerAPI.get("/products", getAllProducts);
routerAPI.get("/products/category/:categoryId", getProductsByCategory);
// Fuzzy search via Elasticsearch
routerAPI.get('/products/search', async (req, res) => {
    try {
        const { 
            q = '', 
            page = 1, 
            limit = 12, 
            categoryId,
            minPrice,
            maxPrice,
            hasDiscount,
            minViews,
            minRating,
            featured,
            inStock,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        const searchParams = {
            q,
            categoryId,
            minPrice,
            maxPrice,
            hasDiscount,
            minViews,
            minRating,
            featured,
            inStock,
            sortBy,
            sortOrder,
            page: pageNum,
            limit: limitNum
        };
        
        const { total, items } = await searchProducts(searchParams);
        
        return res.status(200).json({
            success: true,
            data: items,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum
            }
        });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = routerAPI; //export default