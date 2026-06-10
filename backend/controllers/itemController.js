const itemService = require('../services/itemService');

const addItem = async (req, res) => {
    try {
        const item = await itemService.createItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        // Allows filtering by category later (eg-category=pizza)
        const filters = req.query.category ? { category: req.query.category } : {};
        const items = await itemService.getAllItems(filters);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editItem = async (req, res) => {
    try {
        const item = await itemService.updateItem(req.params.id, req.body);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const item = await itemService.deleteItem(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addItem, getItems, editItem, removeItem };