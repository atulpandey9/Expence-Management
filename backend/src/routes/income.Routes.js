const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income.controller.js');

router.post('/', addIncome);
router.get('/', getIncomes);
router.delete('/:id', deleteIncome);

module.exports = router;
