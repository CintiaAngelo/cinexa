const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');

router.get('/', ideaController.getAllIdeas);
router.get('/:id', ideaController.getIdeaById);
router.post('/', ideaController.submitIdea);

module.exports = router;