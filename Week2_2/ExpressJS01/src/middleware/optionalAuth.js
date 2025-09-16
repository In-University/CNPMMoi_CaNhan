require('dotenv').config();
const jwt = require('jsonwebtoken');

// Optional auth: if Authorization header present and valid, set req.user; otherwise continue silently
const optionalAuth = (req, res, next) => {
    try {
        const header = req?.headers?.authorization;
        if (header && header.split(' ')[1]) {
            const token = header.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = { email: decoded.email, name: decoded.name };
            } catch (err) {
                // invalid token — ignore and continue as anonymous
                // Do not call next(err) because we want listing to work for anonymous
            }
        }
    } catch (err) {
        // ignore
    }
    next();
};

module.exports = optionalAuth;
