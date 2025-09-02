
// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
// const auth = require('../middleware/auth');

// router.use(auth); // Protect all routes after this middleware
const authMiddleware = require('../middleware/authMiddleware');// Your existing auth middleware
const calendarController = require('../controllers/googleCalendarController');


router.get('/',authMiddleware.authenticateToken,eventController.getAllEvents)
router.post('/',authMiddleware.authenticateToken,eventController.createEvent);

router.get('/range',authMiddleware.authenticateToken, eventController.getEventsByDateRange);

router.get('/:id',authMiddleware.authenticateToken,eventController.getEvent)
router.put('/:id',authMiddleware.authenticateToken,eventController.updateEvent)
router.delete('/:id',authMiddleware.authenticateToken,eventController.deleteEvent);

module.exports = router;