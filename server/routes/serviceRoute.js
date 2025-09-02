const express = require('express');
const router = express.Router();
const {getAllServices,getServiceById,flagService, createService,updateService,deleteService} = require('../controllers/serviceController');
const { authenticateToken, authorizeRole} = require('../middleware/authMiddleware');

// Public routes
router.get('/', authenticateToken, getAllServices);
router.get('/:id',authenticateToken, getServiceById);

// Protected routes
router.post('/', authenticateToken, authorizeRole('admin', 'super admin'), createService);
router.put('/:id', authenticateToken, authorizeRole('admin', 'super admin'), updateService);
router.delete('/:id', authenticateToken, authorizeRole( 'admin', 'super admin'), deleteService);
router.patch('/:id/flag', authenticateToken, authorizeRole('super admin'), flagService);

module.exports = router;