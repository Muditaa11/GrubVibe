const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
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
    console.log('Decoded User in Order Route:', req.user);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Place an order (Checkout)
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.itemId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, cartItem) => {
      return total + (cartItem.itemId.itemPrice * cartItem.quantity);
    }, 0);

    // Create a new order
    const order = new Order({
      buyerId: req.user.id,
      items: cart.items.map(cartItem => ({
        itemId: cartItem.itemId._id,
        quantity: cartItem.quantity,
        itemPrice: cartItem.itemId.itemPrice,
      })),
      totalPrice,
      status: 'Pending',
    });

    await order.save();
    console.log('Order Created:', order);

    // Empty the cart
    cart.items = [];
    await cart.save();
    console.log('Cart Emptied:', cart);

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.log('Error in POST /api/order/checkout:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get buyer's order history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    console.log('Fetched orders for user:', orders); // Debug
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get seller's orders
router.get('/seller-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.itemId userId'); // Changed buyerId to userId
    // Filter orders that contain items belonging to the seller
    const sellerOrders = orders.filter(order =>
      order.items.some(item => item.itemId.sellerId.toString() === req.user.id)
    );
    res.json(sellerOrders);
  } catch (error) {
    console.log('Error in GET /api/order/seller-orders:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;