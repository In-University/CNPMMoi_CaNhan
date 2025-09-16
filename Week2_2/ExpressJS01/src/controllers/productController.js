const Product = require('../models/product');
const Category = require('../models/category');
const Comment = require('../models/comment');
const { incrementView, toggleFavorite, addComment, incrementPurchased } = require('../services/productService');
const { searchProducts } = require('../services/searchService');

// Lấy tất cả danh mục
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find({ category: categoryId })
            .populate('category')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments({ category: categoryId });

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find({})
            .populate('category')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments({});

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCategories,
    getProductsByCategory,
    getAllProducts
};

// Get product detail and increment view count
const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        // increment view counter (using existing 'views' field)
        await incrementView(id);
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Explicit endpoint to increase view (useful for SPA)
const postView = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await incrementView(id);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle favorite for authenticated user
const postToggleFavorite = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        // The auth middleware sets req.user with email/name only
        // Attempt to find user by email from users collection
        const User = require('../models/user');
        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        const { id } = req.params;
        const result = await toggleFavorite(user._id, id);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get similar products using Elasticsearch/searchService
const getSimilarProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        // Build a simple search using product name and category
        const q = product.name || '';
        const categoryId = product.category?._id?.toString();
        const { items } = await searchProducts({ q, categoryId, limit: 8, page: 1 });

        // If ES returned items, normalize and filter out current product
        if (items && items.length > 0) {
            const normalized = items.map(i => ({ id: i.id || i._id || i._id?.toString(), ...i }));
            const similar = normalized.filter(i => i.id && i.id.toString() !== id.toString());
            return res.status(200).json({ success: true, data: similar });
        }

        // Fallback: query MongoDB for other products in same category
        const fallbacks = await Product.find({ category: product.category?._id, _id: { $ne: product._id } })
            .populate('category')
            .limit(8)
            .sort({ views: -1 });
        return res.status(200).json({ success: true, data: fallbacks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Post a comment on product (auth required)
const postComment = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        const User = require('../models/user');
        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        const { id } = req.params; // product id
        const { content } = req.body;
        if (!content || !content.trim()) return res.status(400).json({ success: false, message: 'Empty content' });
        const comment = await addComment(user._id, id, content);
        return res.status(200).json({ success: true, data: comment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get comments list for a product
const getComments = async (req, res) => {
    try {
        const { id } = req.params; // product id
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const comments = await Comment.find({ productId: id }).populate('userId', 'name email').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Comment.countDocuments({ productId: id });
        return res.status(200).json({ success: true, data: comments, pagination: { currentPage: parseInt(page), totalItems: total } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Endpoint to increment purchasedCount (call after successful order)
const postPurchased = async (req, res) => {
    try {
        const { id } = req.params; // product id
        const { qty = 1 } = req.body;
        const updated = await incrementPurchased(id, parseInt(qty));
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCategories,
    getProductsByCategory,
    getAllProducts,
    getProductDetail,
    postView,
    postToggleFavorite,
    getSimilarProducts,
    postComment,
    getComments,
    postPurchased
};
