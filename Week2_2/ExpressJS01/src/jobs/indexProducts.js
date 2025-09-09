const Product = require('../models/product');
require('../models/category'); // ensure Category model is registered for populate
const { bulkIndexProducts } = require('../services/searchService');

async function indexAllProducts() {
  const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
  const docs = products.map(p => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description || '',
    price: p.price,
    categoryId: p.category?._id?.toString() || '',
    categoryName: p.category?.name || '',
    image: p.image || '',
    stock: p.stock || 0,
    discount: p.discount || 0,
    views: p.views || 0,
    rating: p.rating || 0,
    featured: p.featured || false,
    inStock: p.inStock !== false,
    createdAt: p.createdAt
  }));
  const res = await bulkIndexProducts(docs);
  console.log(`Indexed products to Elasticsearch: success=${res.indexed}, failed=${res.failed || 0}`);
}

module.exports = { indexAllProducts };
