const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisationController');

const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Public routes
router.get('/', organisationController.getAllImages);
router.get('/:id', organisationController.getImage);

// Protected routes
router.post('/', authenticateToken, organisationController.uploadImage);
router.put('/:id', authenticateToken, organisationController.updateImage);
router.delete('/:id', authenticateToken, organisationController.deleteImage);

module.exports = router;