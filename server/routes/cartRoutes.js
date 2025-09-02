const express = require('express');
const { getCart, addToCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart routes
router.get('/:userId', authMiddleware.authenticateToken, cartController.getUserCart);
router.post('/add', authMiddleware.authenticateToken, cartController.addToCart);
router.put('/updateQuantity', authMiddleware.authenticateToken, cartController.updateCartItem);
router.delete('/remove', authMiddleware.authenticateToken, cartController.removeFromCart);
router.delete('/:userId', authMiddleware.authenticateToken, cartController.clearCart);
router.post('/save', authMiddleware.authenticateToken, cartController.saveCart);

module.exports = router;

