const express = require('express');
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById
} = require('../controllers/productController'); // Import controller functions
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// GET: Retrieve all products (Available to everyone)
router.get('/', getProducts);



// POST: Add a new product (Admin & Super Admin only)
router.post(
  '/',
  // authenticateToken, // Ensure the user is authenticated
  // authorizeRole('admin', 'super admin'), // Check if the user is admin or super admin
  addProduct
);

// PUT: Update a product by ID (Admin & Super Admin only)
router.put(
  '/:id',
  authenticateToken, // Ensure the user is authenticated
  authorizeRole('admin', 'super admin'), // Check if the user is admin or super admin
  updateProduct
);

// DELETE: Delete a product by ID (Admin & Super Admin only)
router.delete(
  '/:id',
  authenticateToken, // Ensure the user is authenticated
  // authorizeRole('admin', 'super admin'), // Check if the user is admin or super admin
  deleteProduct
);


router.get('/:id', authenticateToken,getProductById);

module.exports = router;
