const Income = require('../models/income.model.js');

// @desc    Add a new income
// @route   POST /api/incomes
// @access  Public
const addIncome = async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;

        if (!description || !amount || !category || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const income = await Income.create({
            description,
            amount,
            category,
            date,
            type: 'income'
        });

        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all incomes
// @route   GET /api/incomes
// @access  Public

const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find().sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete an income
// @route   DELETE /api/incomes/:id
// @access  Public
const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ message: 'Income record not found' });
        }

        await income.deleteOne();
        res.status(200).json({ message: 'Income removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addIncome,
    getIncomes,
    deleteIncome
};
