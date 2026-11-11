const express = require('express');

const router = express.Router();

const { convertCurrencySOAP } = require('../controllers/soapController');

router.post('/convert', convertCurrencySOAP);

module.exports = router;