const Product = require('../models/product');
const Category = require('../models/category');

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
