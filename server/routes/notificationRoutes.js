const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const NotificationService = require('../utils/notificationService');

router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.id);
    const notifications = await NotificationService.getNotifications(req.user.id);
    console.log('noty data: ',notifications)
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;