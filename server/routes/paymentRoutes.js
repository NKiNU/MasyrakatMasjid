// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createOrder,
  getOrder,
  updateOrderStatus 
} = require('../controllers/orderController');
const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Service = require('../model/service');
const Donation = require('../model/donations');
const Class = require('../model/class')
const { processPayment } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/orders', authenticateToken, createOrder);
router.post('/payments', authenticateToken, processPayment);
router.get('/orders/:orderId', authenticateToken, getOrder);
router.put('/orders/:orderId/status', authenticateToken, updateOrderStatus);
router.get('/users/:userId/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .populate('serviceDetails.serviceId')
      .populate('donationDetails.donationId')
      .populate('classDetails.classId');

      // console.log(orders)
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;