// 3. Calendar Routes (routes/calendarRoutes.js)
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');// Your existing auth middleware
const calendarController = require('../controllers/googleCalendarController');

router.get('/status', authMiddleware.authenticateToken, calendarController.getStatus);
router.get('/connect', authMiddleware.authenticateToken, calendarController.initializeGoogleCalendar);
router.get('/callback', calendarController.handleGoogleCallback);
router.get('/events', authMiddleware.authenticateToken, calendarController.getEvents);
router.post('/events', authMiddleware.authenticateToken, calendarController.createEvent);
router.patch('/events/:id', authMiddleware.authenticateToken, calendarController.updateEvent);
router.delete('/events/:id', authMiddleware.authenticateToken, calendarController.deleteEvent);

module.exports = router;