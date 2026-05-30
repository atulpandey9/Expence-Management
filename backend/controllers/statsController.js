const Income = require('../models/incomemodel');
const Expense = require('../models/expencemodel');

// @desc    Get dashboard summary stats
// @route   GET /api/stats/summary
// @access  Public
const getSummary = async (req, res) => {
    try {
        const incomes = await Income.find();
        const expenses = await Expense.find();

        const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
        const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
        const totalBalance = totalIncome - totalExpenses;

        // Monthly stats calculation
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed

        const monthlyIncomesList = incomes.filter(item => {
            const d = new Date(item.date);
            return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });

        const monthlyExpensesList = expenses.filter(item => {
            const d = new Date(item.date);
            return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });

        const monthlyIncome = monthlyIncomesList.reduce((acc, item) => acc + item.amount, 0);
        const monthlyExpenses = monthlyExpensesList.reduce((acc, item) => acc + item.amount, 0);

        let savingsRate = 0;
        if (monthlyIncome > 0) {
            savingsRate = Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100);
        }

        // Today's stats (local calendar date matching)
        const todayStr = now.toDateString(); // "Wed May 30 2026" format to match local date
        
        const todayExpensesList = expenses.filter(item => {
            const d = new Date(item.date);
            return d.toDateString() === todayStr;
        });
        const todayExpenses = todayExpensesList.reduce((acc, item) => acc + item.amount, 0);

        const todayIncomesList = incomes.filter(item => {
            const d = new Date(item.date);
            return d.toDateString() === todayStr;
        });
        const todayIncome = todayIncomesList.reduce((acc, item) => acc + item.amount, 0);
        const todaySavings = Math.max(0, todayIncome - todayExpenses);

        // Recent combined transactions
        const formattedIncomes = incomes.map(item => ({
            _id: item._id,
            description: item.description,
            amount: item.amount,
            category: item.category,
            date: item.date,
            type: 'income'
        }));

        const formattedExpenses = expenses.map(item => ({
            _id: item._id,
            description: item.description,
            amount: item.amount,
            category: item.category,
            date: item.date,
            type: 'expense'
        }));

        const combinedTransactions = [...formattedIncomes, ...formattedExpenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        // Spending by category (grouped)
        const spendingByCategory = {};
        expenses.forEach(item => {
            if (spendingByCategory[item.category]) {
                spendingByCategory[item.category] += item.amount;
            } else {
                spendingByCategory[item.category] = item.amount;
            }
        });

        // Income by category (grouped)
        const incomeByCategory = {};
        incomes.forEach(item => {
            if (incomeByCategory[item.category]) {
                incomeByCategory[item.category] += item.amount;
            } else {
                incomeByCategory[item.category] = item.amount;
            }
        });

        res.status(200).json({
            totalBalance,
            totalIncome,
            totalExpenses,
            monthlyIncome,
            monthlyExpenses,
            savingsRate,
            todayExpenses,
            todayIncome,
            todaySavings,
            recentTransactions: combinedTransactions,
            spendingByCategory,
            incomeByCategory
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getSummary
};
