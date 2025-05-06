const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
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

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
    const { itemId, itemName, itemPrice, itemInfo, itemImage, location, quantity } = req.body;

    if (!itemId || !itemName || !itemPrice || !itemInfo || !itemImage || !location) {
      return res.status(400).json({ message: 'All item fields are required' });
    }


  if (!itemId) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.itemId.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        itemId,
        itemName,
        itemPrice,
        itemInfo,
        itemImage,
        location,
        quantity: quantity || 1,
      });
      
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get cart for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(200).json({ items: [] }); // return empty if no cart yet
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Checkout route
router.post('/checkout', authenticateToken, async (req, res) => {

  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.itemId');

    if (!cart) {
      return res.status(400).json({ message: 'Cart not found' });
    }
    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!cart._id) {
      return res.status(400).json({ message: 'Cart id is not found' });
    }



    // Calculate total price
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.itemPrice * item.quantity;
    });

    // Create the order
    const order = new Order({
      userId: req.user.id,
      items: cart.items,
      totalPrice,
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    // Notify seller (You can implement your own logic here)
    // For example, sending an email to the seller or sending a notification

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Empty the cart
router.delete('/empty', authenticateToken, async (req, res) => {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Empty the cart by setting items to an empty array
    cart.items = [];

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart has been emptied', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;