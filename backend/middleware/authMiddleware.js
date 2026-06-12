const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1: Is the user logged in?
const protect = async (req, res, next) => {
    let token;

    // Check if the request has a Bearer token in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database and attach it to the request object
            req.user = await User.findById(decoded.id).select('-password');
            
            // Allow the request to proceed to the next step
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// 2: Is the logged-in user an Admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next(); // User is an admin, let them through
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = { protect, admin };