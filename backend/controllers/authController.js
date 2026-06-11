const authService = require('../services/authService');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await authService.registerUser(userData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// GET: logged-in user's profile
const getMe = async (req, res) => {
    try {
        res.status(200).json({
            _id: req.user?._id || req.user?.id,
            name: req.user?.name,
            email: req.user?.email,
            phone: req.user?.phone,
            role: req.user?.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: update logged-in user's profile (name, email, phone)
const updateMe = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            {
                ...(name !== undefined ? { name } : {}),
                ...(email !== undefined ? { email } : {}),
                ...(phone !== undefined ? { phone } : {}),
            },
            { new: true, runValidators: true }
        ).select('-password');


        res.status(200).json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            role: updated.role,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateMe
};
