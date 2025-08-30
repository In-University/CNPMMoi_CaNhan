const mongoose = require('mongoose');
const User = require('../models/user');
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

module.exports = seedUsers;
