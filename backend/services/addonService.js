const Addon = require('../models/Addon');

const getAddonsByCategory = async (category) => {
  const filters = {
    isAvailable: true,
  };

  if (category) filters.category = category;

  return Addon.find(filters).sort({ name: 1 });
};

const createAddon = async (payload) => {
  const addon = await Addon.create(payload);
  return addon;
};

const updateAddon = async (id, payload) => {
  const addon = await Addon.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return addon;
};

const deleteAddon = async (id) => {
  const addon = await Addon.findByIdAndDelete(id);
  return addon;
};

const getAllAddons = async () => {
  return Addon.find({}).sort({ createdAt: -1 });
};

module.exports = {
  getAddonsByCategory,
  createAddon,
  updateAddon,
  deleteAddon,
  getAllAddons,
};

