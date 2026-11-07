const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense.controller.js');
const { authuser } = require('../middleware/auth.middleware.js');

router.post('/', authuser, addExpense);
router.get('/', getExpenses);
router.delete('/:id', authuser, deleteExpense);

module.exports = router;
