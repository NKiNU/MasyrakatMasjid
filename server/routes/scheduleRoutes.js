const express = require('express');
const { getSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const {authenticateToken} = require('../middleware/authMiddleware')

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
