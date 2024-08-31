const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/storiesController');

router.post('/new-stories', storiesController.createStories);
router.get('/stories/:userId', storiesController.getStoriesByUserId);
router.get('/:id', storiesController.getStoriesById);

module.exports = router;