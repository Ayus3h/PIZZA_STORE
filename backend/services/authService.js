const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = async (userData) => {
    const { name, email, password, role, phone } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const user = await User.create({ name, email, password, role, phone });
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role)
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id, user.role)
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

module.exports = { registerUser, loginUser };
