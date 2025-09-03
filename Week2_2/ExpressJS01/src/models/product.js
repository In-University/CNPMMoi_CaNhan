const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;
