const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const {authenticateToken} = require('../middleware/authMiddleware'); // Your authentication middleware

// Create new class
router.post('/', authenticateToken, classController.createClass);

// Join a class
router.post('/:classId/join', authenticateToken, classController.joinClass);

// Public routes
router.get('/', classController.getAllClasses);
router.get('/:classId', classController.getClassById);

// Protected routes
// Apply auth middleware to all routes below
router.put('/:classId',authenticateToken, classController.updateClass);
router.delete('/:classId',authenticateToken, classController.deleteClass);
// router.post('/:classId/join',authMiddleware, classController.joinClass);
router.post('/:classId/leave',authenticateToken, classController.leaveClass);
router.get('/my/created',authenticateToken, classController.getMyCreatedClasses);
router.get('/my/joined',authenticateToken, classController.getMyJoinedClasses);

module.exports = router;