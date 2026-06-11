const express = require('express');
const addonController = require('../controllers/addonController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer/public
router.get('/', addonController.getAddons);

// Admin
router.get('/all', protect, admin, addonController.getAllAddons);
router.post('/', protect, admin, addonController.createAddon);
router.put('/:id', protect, admin, addonController.updateAddon);
router.delete('/:id', protect, admin, addonController.deleteAddon);

module.exports = router;

