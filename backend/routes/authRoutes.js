const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile (requires auth)
router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateMe);

module.exports = router;
