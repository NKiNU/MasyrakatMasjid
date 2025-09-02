// routes/content.js
const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');
const {handleFlagNotifications,handleUnflagNotifications} = require('../controllers/flagController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Flag content route - works for all content types
router.post('/:contentType/:id/flag', authenticateToken, async (req, res) => {
  try {
    console.log("in create flag")
    const { contentType, id } = req.params;
    console.log(contentType + id)
    const { message } = req.body;

    // Get the appropriate model based on content type
    const Model = getModelForContentType(contentType);
    if (!Model) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findById(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Update content with flag details
    content.isHidden = true;
    content.flagMessage = message;
    content.flaggedBy = req.user._id;
    content.flaggedAt = new Date();

    await content.save();

    res.json({ message: 'Content flagged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error flagging content' });
  }
});

// Unflag content route
router.post('/:contentType/:id/unflag', authenticateToken, async (req, res) => {
  try {
    const { contentType, id } = req.params;

    const Model = getModelForContentType(contentType);
    if (!Model) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Model.findById(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Remove flag details
    content.isHidden = false;
    content.flagMessage = undefined;
    content.flaggedBy = undefined;
    content.flaggedAt = undefined;

    await content.save();

    res.json({ message: 'Content unflagged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unflagging content' });
  }
});

// Helper function to get the appropriate model
function getModelForContentType(type) {
  const models = {
    'classes': require('../model/class'),
    'donations': require('../model/donations'),
    'videos': require('../model/islamicvideo'),
    'news': require('../model/news'),
    'products': require('../model/product'),
    'services': require('../model/service')
  };
  return models[type];
}

router.post('/notifications/flag', handleFlagNotifications);
router.post('/notifications/unflag', handleUnflagNotifications);

module.exports = router;