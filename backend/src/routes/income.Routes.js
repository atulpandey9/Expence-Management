const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income.controller.js');
const { authuser } = require('../middleware/auth.middleware.js');

router.post('/', authuser, addIncome);
router.get('/', getIncomes);
router.delete('/:id', authuser, deleteIncome);

module.exports = router;
