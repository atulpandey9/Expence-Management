const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/stats.controller.js');

router.get('/summary', getSummary);

module.exports = router;
