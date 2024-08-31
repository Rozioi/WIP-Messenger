const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateToken ,authController.logout);
router.post('/token', authController.refreshToken);

module.exports = router;