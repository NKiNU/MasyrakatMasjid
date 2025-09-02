const express = require('express');
const router = express.Router();
const {createBooking, getUserBookings, getAllBookings, updateBookingStatus} = require('../controllers/bookingController'); 
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');


// User routes
router.post('/', authenticateToken, createBooking);
router.get('/user', authenticateToken, getUserBookings);

// Admin routes
router.get('/', authenticateToken, authorizeRole('admin', 'super admin'), getAllBookings);
router.put('/:id/status', authenticateToken, authorizeRole('admin', 'super admin'), updateBookingStatus);


module.exports = router;