const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is a seller
const isSeller = async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    if (!user || user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Sellers only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Post a new item (seller only)
router.post('/', authenticateToken, isSeller, async (req, res) => {
  const { itemName, itemPrice, itemInfo, itemImage, location } = req.body;

  if (!itemName || !itemPrice || !itemInfo || !itemImage || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newItem = new Item({
      itemName,
      itemPrice,
      itemInfo,
      itemImage,
      location,
      sellerId: req.user.id,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item posted successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('sellerId', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;