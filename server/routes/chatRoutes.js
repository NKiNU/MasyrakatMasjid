const express = require('express');
const { getContacts, getChatHistory,saveMessage } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/messages',authMiddleware.authenticateToken, saveMessage);
router.get('/contacts',authMiddleware.authenticateToken, getContacts);
router.get('/chats/:contactId',authMiddleware.authenticateToken, getChatHistory);
module.exports = router;
