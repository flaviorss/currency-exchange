const express = require('express');

const router = express.Router();

const {
    convertCurrency
} = require('../controllers/conversionController');

router.post('/convert', convertCurrency);

module.exports = router;