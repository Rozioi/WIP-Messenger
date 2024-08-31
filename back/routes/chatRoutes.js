const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:id', chatController.getChatById);
router.get('/:id/members', chatController.getUsersByChatId);
router.get('/user/:id', chatController.getUserChats);
router.post('/create-group', chatController.createGroup);
router.post('/update-group', chatController.updateGroup);
router.post('/new-chat', chatController.createChat);
router.post('/leave', chatController.leaveAGroup)
router.delete('/delete/:id', chatController.deleteChat);
router.post('/two-user', chatController.getTwoUser);
router.get('/group/membersCount/:chatId', chatController.getChatInfo);

module.exports = router;