const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

router.post('/picture', upload.single('profile_picture'), uploadController.uploadProfilePicture);
router.get('/:filename', uploadController.downloadProfilePicture);

module.exports = router;