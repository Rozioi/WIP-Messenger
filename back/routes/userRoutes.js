const express = require('express');
const router = express.Router();
const userRoutes = require('../controllers/userController');

router.get('/search/:username', userRoutes.userList);
router.get('/profile/:username', userRoutes.profileUser);
router.put('/profile/', userRoutes.editProfile);
router.get('/user/:id', userRoutes.userById);
router.post('/add-friend', userRoutes.addToFriend);
router.post('/check-friendship', userRoutes.checkFriendship);
router.delete('/delete/:id', userRoutes.deleteFriendShip);
router.get('/friend-list/:id', userRoutes.friendListByUserId);

module.exports = router;