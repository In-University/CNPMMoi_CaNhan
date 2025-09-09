const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
    try {
        // Check if users already exist to prevent duplicate seeding
        const existingUsers = await User.find();
        if (existingUsers.length > 0) {
            console.log('Users already exist. Skipping seeding.');
            return;
        }

        const hashedPassword = await bcrypt.hash('password123', 10); // Hash a default password

        const users = [
            { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
            { name: 'Regular User', email: 'user@example.com', password: hashedPassword, role: 'user' },
        ];

        await User.insertMany(users);
        console.log('Users seeded successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

const seedCategories = async () => {
  try {
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log('Categories already exist. Skipping seeding.');
      return;
    }
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Books', description: 'Books and literature' },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
    ];
    await Category.insertMany(categories);
    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

const seedProducts = async () => {
  try {
    // await Product.deleteMany({});
    // console.log('Existing products cleared.');
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found. Please seed categories first.');
      return;
    }
    
    // Helper function to generate random values
    const getRandomDiscount = () => Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 5 : 0;
    const getRandomViews = () => Math.floor(Math.random() * 1000) + 10;
    const getRandomRating = () => Math.round((Math.random() * 4 + 1) * 10) / 10; // 1.0 to 5.0
    const getRandomFeatured = () => Math.random() > 0.8;
    const getRandomInStock = (stock) => stock > 0;
    
    const products = [
      { 
        name: 'Laptop', 
        description: 'High-performance laptop', 
        price: 999, 
        category: categories[0]._id, 
        stock: 10, 
        discount: getRandomDiscount(),
        views: getRandomViews(),
        rating: getRandomRating(),
        featured: getRandomFeatured(),
        inStock: true,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' 
      },
      { 
        name: 'Smartphone', 
        description: 'Latest smartphone', 
        price: 699, 
        category: categories[0]._id, 
        stock: 15, 
        discount: getRandomDiscount(),
        views: getRandomViews(),
        rating: getRandomRating(),
        featured: getRandomFeatured(),
        inStock: true,
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' 
      },
      { 
        name: 'Tablet', 
        description: 'Portable tablet device', 
        price: 399, 
        category: categories[0]._id, 
        stock: 20, 
        discount: getRandomDiscount(),
        views: getRandomViews(),
        rating: getRandomRating(),
        featured: getRandomFeatured(),
        inStock: true,
        image: 'https://images.unsplash.com/photo-1561152044-72c8d5b13c19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' 
      },
      { 
        name: 'Headphones', 
        description: 'Wireless noise-cancelling headphones', 
        price: 199, 
        category: categories[0]._id, 
        stock: 25, 
        discount: getRandomDiscount(),
        views: getRandomViews(),
        rating: getRandomRating(),
        featured: getRandomFeatured(),
        inStock: true,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' 
      },
      { 
        name: 'Smartwatch', 
        description: 'Fitness tracking smartwatch', 
        price: 299, 
        category: categories[0]._id, 
        stock: 12, 
        discount: getRandomDiscount(),
        views: getRandomViews(),
        rating: getRandomRating(),
        featured: getRandomFeatured(),
        inStock: true,
        image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' 
      },
      { name: 'Camera', description: 'Digital camera for photography', price: 599, category: categories[0]._id, stock: 8, image: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1352&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Printer', description: 'All-in-one inkjet printer', price: 149, category: categories[0]._id, stock: 10, image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Monitor', description: '4K ultra-wide monitor', price: 499, category: categories[0]._id, stock: 15, image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Keyboard', description: 'Mechanical gaming keyboard', price: 89, category: categories[0]._id, stock: 30, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Mouse', description: 'Wireless ergonomic mouse', price: 39, category: categories[0]._id, stock: 40, image: 'https://images.unsplash.com/photo-1615663245657-db3c2a865f57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Gaming Console', description: 'Next-gen gaming console', price: 499, category: categories[0]._id, stock: 10, image: 'https://images.unsplash.com/photo-1589254065909-b7086229d08c', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Bluetooth Speaker', description: 'Portable and waterproof speaker', price: 79, category: categories[0]._id, stock: 50, image: 'https://images.unsplash.com/photo-1589100723912-295335934957', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Drone', description: '4K camera drone with GPS', price: 349, category: categories[0]._id, stock: 15, image: 'https://images.unsplash.com/photo-1507582020474-9a334a761915', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Projector', description: 'Full HD home theater projector', price: 250, category: categories[0]._id, stock: 20, image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Webcam', description: '1080p HD webcam for streaming', price: 59, category: categories[0]._id, stock: 40, image: 'https://images.unsplash.com/photo-1614624532983-785c2f769f23', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      
      { name: 'T-Shirt', description: 'Cotton t-shirt', price: 19, category: categories[1]._id, stock: 50, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Jeans', description: 'Denim jeans', price: 49, category: categories[1]._id, stock: 30, image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Jacket', description: 'Waterproof jacket', price: 79, category: categories[1]._id, stock: 20, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Sneakers', description: 'Comfortable running sneakers', price: 69, category: categories[1]._id, stock: 35, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Dress', description: 'Elegant evening dress', price: 99, category: categories[1]._id, stock: 15, image: 'https://images.unsplash.com/photo-1594618765101-2303c031a0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Hat', description: 'Stylish baseball cap', price: 15, category: categories[1]._id, stock: 60, image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Sweater', description: 'Warm wool sweater', price: 59, category: categories[1]._id, stock: 25, image: 'https://images.unsplash.com/photo-1683315565563-f72590773805?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Shorts', description: 'Casual summer shorts', price: 29, category: categories[1]._id, stock: 45, image: 'https://images.unsplash.com/photo-1591195853828-11db59a41f67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Skirt', description: 'Flowy midi skirt', price: 39, category: categories[1]._id, stock: 30, image: 'https://images.unsplash.com/photo-1593902379379-9ac32a8a1f89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Boots', description: 'Leather ankle boots', price: 89, category: categories[1]._id, stock: 20, image: 'https://images.unsplash.com/photo-1599351378393-277151e36f1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Socks', description: 'Comfortable cotton socks', price: 9, category: categories[1]._id, stock: 100, image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Scarf', description: 'Warm winter scarf', price: 25, category: categories[1]._id, stock: 40, image: 'https://images.unsplash.com/photo-1533658239932-2976b45a5093', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Gloves', description: 'Leather winter gloves', price: 35, category: categories[1]._id, stock: 30, image: 'https://images.unsplash.com/photo-1519891933819-c1a53e6a6946', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Belt', description: 'Genuine leather belt', price: 45, category: categories[1]._id, stock: 50, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Wallet', description: 'Slim leather wallet', price: 30, category: categories[1]._id, stock: 60, image: 'https://images.unsplash.com/photo-1553062407-98eada6b36a5', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },

      { name: 'Novel', description: 'Bestselling novel', price: 12, category: categories[2]._id, stock: 100, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Cookbook', description: 'Recipes and cooking tips', price: 25, category: categories[2]._id, stock: 20, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Biography', description: 'Inspiring biography', price: 18, category: categories[2]._id, stock: 40, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Science Fiction', description: 'Futuristic sci-fi adventure', price: 14, category: categories[2]._id, stock: 50, image: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Mystery', description: 'Thrilling mystery novel', price: 16, category: categories[2]._id, stock: 35, image: 'https://images.unsplash.com/photo-1513299732065-f1d24f0a2f5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Poetry', description: 'Collection of modern poems', price: 10, category: categories[2]._id, stock: 25, image: 'https://images.unsplash.com/photo-1512068284666-87c1c6218d2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'History Book', description: 'Ancient civilizations history', price: 22, category: categories[2]._id, stock: 30, image: 'https://images.unsplash.com/photo-1567114639912-8705f1f9ce38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Self-Help', description: 'Personal development guide', price: 20, category: categories[2]._id, stock: 45, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Children\'s Book', description: 'Fun illustrated storybook', price: 8, category: categories[2]._id, stock: 60, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Textbook', description: 'Mathematics textbook', price: 35, category: categories[2]._id, stock: 15, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Fantasy Novel', description: 'Epic fantasy adventure', price: 15, category: categories[2]._id, stock: 60, image: 'https://images.unsplash.com/photo-1530538987311-a2479b2743d2', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Travel Guide', description: 'Guide to exploring the world', price: 24, category: categories[2]._id, stock: 30, image: 'https://images.unsplash.com/photo-1527632911563-ee5b6d5349d3', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Art Book', description: 'Collection of famous paintings', price: 50, category: categories[2]._id, stock: 20, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Comic Book', description: 'Superhero comic book', price: 5, category: categories[2]._id, stock: 150, image: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Journal', description: 'Leather-bound journal', price: 18, category: categories[2]._id, stock: 80, image: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },

      { name: 'Garden Hose', description: 'Durable garden hose', price: 29, category: categories[3]._id, stock: 25, image: 'https://images.unsplash.com/photo-1594498839016-175a151b54b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Lawn Mower', description: 'Electric lawn mower', price: 199, category: categories[3]._id, stock: 5, image: 'https://images.unsplash.com/photo-1590820292118-e256c3ac2676?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Grill', description: 'Charcoal barbecue grill', price: 149, category: categories[3]._id, stock: 10, image: 'https://images.unsplash.com/photo-1534797258760-1bd2cc95a5bd?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Patio Furniture', description: 'Outdoor patio set', price: 399, category: categories[3]._id, stock: 8, image: 'https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Garden Tools', description: 'Set of gardening tools', price: 49, category: categories[3]._id, stock: 30, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Bird Feeder', description: 'Hanging bird feeder', price: 19, category: categories[3]._id, stock: 40, image: 'https://images.unsplash.com/photo-1565843708743-9f1a0d3f2a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Planter', description: 'Ceramic flower planter', price: 24, category: categories[3]._id, stock: 50, image: 'https://images.unsplash.com/photo-1485955913233-a0a7df49a2b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Hammock', description: 'Comfortable outdoor hammock', price: 79, category: categories[3]._id, stock: 15, image: 'https://images.unsplash.com/photo-1563298723-d09aa276f23c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Watering Can', description: 'Metal watering can', price: 14, category: categories[3]._id, stock: 35, image: 'https://images.unsplash.com/photo-1692651771569-95dd3ed878a8?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Garden Statue', description: 'Decorative garden gnome', price: 34, category: categories[3]._id, stock: 20, image: 'https://images.unsplash.com/photo-1605275033285-88a4253e028c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Indoor Plant', description: 'Low-maintenance house plant', price: 22, category: categories[3]._id, stock: 40, image: 'https://images.unsplash.com/photo-1485955913233-a0a7df49a2b8', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Picture Frame', description: 'Wooden picture frame', price: 15, category: categories[3]._id, stock: 70, image: 'https://images.unsplash.com/photo-1541119349998-a37a1a432def', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Scented Candle', description: 'Lavender scented candle', price: 12, category: categories[3]._id, stock: 100, image: 'https://images.unsplash.com/photo-1594035932229-d8874a18a36b', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Wall Clock', description: 'Modern minimalist wall clock', price: 40, category: categories[3]._id, stock: 30, image: 'https://images.unsplash.com/photo-1533144147132-464a3275121a', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
      { name: 'Desk Lamp', description: 'Adjustable LED desk lamp', price: 35, category: categories[3]._id, stock: 45, image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31', discount: getRandomDiscount(), views: getRandomViews(), rating: getRandomRating(), featured: getRandomFeatured(), inStock: true },
    ];
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = { seedUsers, seedCategories, seedProducts };