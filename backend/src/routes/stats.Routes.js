const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/stats.controller.js');
const { authuser } = require('../middleware/auth.middleware.js');

// Protected: summary stats are scoped per-user via Redis cache key
router.get('/summary', authuser, getSummary);

module.exports = router;
