const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const newsletterController = require('../controllers/newsletterController');

router.post('/send/:id', apiKeyAuth, newsletterController.sendNewsletter);
router.get('/', apiKeyAuth, newsletterController.listNewsletters);
router.post('/', apiKeyAuth, newsletterController.createNewsletter);

module.exports = router;