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
    const products = [
      { name: 'Laptop', description: 'High-performance laptop', price: 999, category: categories[0]._id, stock: 10, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Smartphone', description: 'Latest smartphone', price: 699, category: categories[0]._id, stock: 15, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Tablet', description: 'Portable tablet device', price: 399, category: categories[0]._id, stock: 20, image: 'https://images.unsplash.com/photo-1561152044-72c8d5b13c19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Headphones', description: 'Wireless noise-cancelling headphones', price: 199, category: categories[0]._id, stock: 25, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Smartwatch', description: 'Fitness tracking smartwatch', price: 299, category: categories[0]._id, stock: 12, image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Camera', description: 'Digital camera for photography', price: 599, category: categories[0]._id, stock: 8, image: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1352&q=80' },
      { name: 'Printer', description: 'All-in-one inkjet printer', price: 149, category: categories[0]._id, stock: 10, image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Monitor', description: '4K ultra-wide monitor', price: 499, category: categories[0]._id, stock: 15, image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Keyboard', description: 'Mechanical gaming keyboard', price: 89, category: categories[0]._id, stock: 30, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Mouse', description: 'Wireless ergonomic mouse', price: 39, category: categories[0]._id, stock: 40, image: 'https://images.unsplash.com/photo-1615663245657-db3c2a865f57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'T-Shirt', description: 'Cotton t-shirt', price: 19, category: categories[1]._id, stock: 50, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Jeans', description: 'Denim jeans', price: 49, category: categories[1]._id, stock: 30, image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Jacket', description: 'Waterproof jacket', price: 79, category: categories[1]._id, stock: 20, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Sneakers', description: 'Comfortable running sneakers', price: 69, category: categories[1]._id, stock: 35, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Dress', description: 'Elegant evening dress', price: 99, category: categories[1]._id, stock: 15, image: 'https://images.unsplash.com/photo-1594618765101-2303c031a0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Hat', description: 'Stylish baseball cap', price: 15, category: categories[1]._id, stock: 60, image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Sweater', description: 'Warm wool sweater', price: 59, category: categories[1]._id, stock: 25, image: 'https://images.unsplash.com/photo-1683315565563-f72590773805?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Shorts', description: 'Casual summer shorts', price: 29, category: categories[1]._id, stock: 45, image: 'https://images.unsplash.com/photo-1591195853828-11db59a41f67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Skirt', description: 'Flowy midi skirt', price: 39, category: categories[1]._id, stock: 30, image: 'https://images.unsplash.com/photo-1593902379379-9ac32a8a1f89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Boots', description: 'Leather ankle boots', price: 89, category: categories[1]._id, stock: 20, image: 'https://images.unsplash.com/photo-1599351378393-277151e36f1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Novel', description: 'Bestselling novel', price: 12, category: categories[2]._id, stock: 100, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Cookbook', description: 'Recipes and cooking tips', price: 25, category: categories[2]._id, stock: 20, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Biography', description: 'Inspiring biography', price: 18, category: categories[2]._id, stock: 40, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Science Fiction', description: 'Futuristic sci-fi adventure', price: 14, category: categories[2]._id, stock: 50, image: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Mystery', description: 'Thrilling mystery novel', price: 16, category: categories[2]._id, stock: 35, image: 'https://images.unsplash.com/photo-1513299732065-f1d24f0a2f5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Poetry', description: 'Collection of modern poems', price: 10, category: categories[2]._id, stock: 25, image: 'https://images.unsplash.com/photo-1512068284666-87c1c6218d2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'History Book', description: 'Ancient civilizations history', price: 22, category: categories[2]._id, stock: 30, image: 'https://images.unsplash.com/photo-1567114639912-8705f1f9ce38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Self-Help', description: 'Personal development guide', price: 20, category: categories[2]._id, stock: 45, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Children\'s Book', description: 'Fun illustrated storybook', price: 8, category: categories[2]._id, stock: 60, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Textbook', description: 'Mathematics textbook', price: 35, category: categories[2]._id, stock: 15, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80' },
      { name: 'Garden Hose', description: 'Durable garden hose', price: 29, category: categories[3]._id, stock: 25, image: 'https://images.unsplash.com/photo-1594498839016-175a151b54b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Lawn Mower', description: 'Electric lawn mower', price: 199, category: categories[3]._id, stock: 5, image: 'https://images.unsplash.com/photo-1590820292118-e256c3ac2676?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Grill', description: 'Charcoal barbecue grill', price: 149, category: categories[3]._id, stock: 10, image: 'https://images.unsplash.com/photo-1534797258760-1bd2cc95a5bd?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Patio Furniture', description: 'Outdoor patio set', price: 399, category: categories[3]._id, stock: 8, image: 'https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80' },
      { name: 'Garden Tools', description: 'Set of gardening tools', price: 49, category: categories[3]._id, stock: 30, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Bird Feeder', description: 'Hanging bird feeder', price: 19, category: categories[3]._id, stock: 40, image: 'https://images.unsplash.com/photo-1565843708743-9f1a0d3f2a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Planter', description: 'Ceramic flower planter', price: 24, category: categories[3]._id, stock: 50, image: 'https://images.unsplash.com/photo-1485955913233-a0a7df49a2b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
      { name: 'Hammock', description: 'Comfortable outdoor hammock', price: 79, category: categories[3]._id, stock: 15, image: 'https://images.unsplash.com/photo-1563298723-d09aa276f23c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
      { name: 'Watering Can', description: 'Metal watering can', price: 14, category: categories[3]._id, stock: 35, image: 'htthttps://images.unsplash.com/photo-1692651771569-95dd3ed878a8?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Garden Statue', description: 'Decorative garden gnome', price: 34, category: categories[3]._id, stock: 20, image: 'https://images.unsplash.com/photo-1605275033285-88a4253e028c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80' },
    ];
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = { seedUsers, seedCategories, seedProducts };