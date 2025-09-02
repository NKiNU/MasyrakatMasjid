// routes/availability.routes.js
const express = require('express');
const router = express.Router();
const {getAvailability, addAvailability,getServiceAvailability, updateAvailability} = require('../controllers/availabilityController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', getAvailability);
router.post('/', authenticateToken, authorizeRole('admin', 'super admin'), addAvailability);
router.get('/service/:id', authenticateToken, getServiceAvailability);
router.put('/:id', authenticateToken, updateAvailability);

module.exports = router;