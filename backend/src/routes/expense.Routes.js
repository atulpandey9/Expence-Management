const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense.controller.js');

router.post('/', addExpense);
router.get('/', getExpenses);
router.delete('/:id', deleteExpense);

module.exports = router;
