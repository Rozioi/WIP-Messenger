const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/:chatId/message', messageController.sendMessage);
router.get('/:chatId/messages', messageController.getMessagesByChatId);

module.exports = router;