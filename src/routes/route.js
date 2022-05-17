const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')


router.post('/url/shorten', controller.urlShort);
router.get('/:urlCode', controller.getUrlDetails);



module.exports = router;