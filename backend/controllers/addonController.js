const addonService = require('../services/addonService');

const getAddons = async (req, res) => {
  try {
    const { category } = req.query;
    const addons = await addonService.getAddonsByCategory(category);
    res.status(200).json(addons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAddon = async (req, res) => {
  try {
    const addon = await addonService.createAddon(req.body);
    res.status(201).json(addon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAddon = async (req, res) => {
  try {
    const addon = await addonService.updateAddon(req.params.id, req.body);
    if (!addon) return res.status(404).json({ message: 'Addon not found' });
    res.status(200).json(addon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAddon = async (req, res) => {
  try {
    const addon = await addonService.deleteAddon(req.params.id);
    if (!addon) return res.status(404).json({ message: 'Addon not found' });
    res.status(200).json({ message: 'Addon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAddons = async (req, res) => {
  try {
    const addons = await addonService.getAllAddons();
    res.status(200).json(addons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAddons,
  createAddon,
  updateAddon,
  deleteAddon,
  getAllAddons,
};

