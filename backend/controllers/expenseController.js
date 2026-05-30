const Expense = require('../models/expencemodel');

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Public
const addExpense = async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;

        if (!description || !amount || !category || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const expense = await Expense.create({
            description,
            amount,
            category,
            date,
            type: 'expense'
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense record not found' });
        }

        await expense.deleteOne();
        res.status(200).json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
};
