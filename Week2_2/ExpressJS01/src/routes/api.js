const express = require('express');
const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const { getCategories, getProductsByCategory, getAllProducts } = require('../controllers/productController');
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

module.exports = routerAPI; //export default