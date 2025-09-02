// routes/feedbackRoutes.js
const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(authenticateToken, feedbackController.createFeedback)
  .get(
    authenticateToken, 
    authorizeRole('admin', 'super admin'), 
    feedbackController.getAllFeedback
  );

router
  .route('/:id')
  .get(authenticateToken, feedbackController.getFeedbackById)
  .patch(
    authenticateToken, 
    authorizeRole('admin', 'super admin'), 
    feedbackController.updateFeedbackStatus
  )
  .delete(
    authenticateToken, 
    authorizeRole('admin', 'super admin'), 
    feedbackController.deleteFeedback
  );

module.exports = router;