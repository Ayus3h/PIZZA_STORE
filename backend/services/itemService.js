const Item = require('../models/Item');

const createItem = async (itemData) => {
    return await Item.create(itemData);
};

const getAllItems = async (filters = {}) => {
    return await Item.find(filters);
};

const updateItem = async (id, updateData) => {
    return await Item.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteItem = async (id) => {
    return await Item.findByIdAndDelete(id);
};

module.exports = {
    createItem,
    getAllItems,
    updateItem,
    deleteItem
};