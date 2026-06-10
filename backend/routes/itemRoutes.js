const express = require('express');
const itemController = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import the guards

const router = express.Router();

// PUBLIC ROUTE (Anyone can view the menu)
router.get('/', itemController.getItems);

// PROTECTED ADMIN ROUTES
router.post('/', protect, admin, itemController.addItem);
router.put('/:id', protect, admin, itemController.editItem);
router.delete('/:id', protect, admin, itemController.removeItem);

module.exports = router;