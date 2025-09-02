const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imamController');

const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Public routes
router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImage);

// Protected routes
router.post('/', authenticateToken, imageController.uploadImage);
router.put('/:id', authenticateToken, imageController.updateImage);
router.delete('/:id', authenticateToken, imageController.deleteImage);

module.exports = router;