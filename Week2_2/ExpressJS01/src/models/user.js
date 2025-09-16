const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    // list of favorite product ids
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    // optional: recent viewed products (keep small, e.g., last 20)
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);
module.exports = User;