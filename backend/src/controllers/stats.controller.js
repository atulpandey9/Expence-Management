const Income = require('../models/income.model.js');
const Expense = require('../models/expence.model.js');
const { getCache, setCache, CACHE_KEYS } = require('../config/redis.js');

const SUMMARY_CACHE_TTL = 60; // seconds

// @desc    Get dashboard summary stats
// @route   GET /api/stats/summary
// @access  Public

const getSummary = async (req, res) => {
    try {
        // Return the cached summary for this user when available
        const cachedSummary = await getCache(CACHE_KEYS.SUMMARY(req.user.id));
        if (cachedSummary) {
            return res.status(200).json(cachedSummary);
        }

        const incomes = await Income.find();
        const expenses = await Expense.find();

        const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
        const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
        const totalBalance = totalIncome - totalExpenses;

        // Monthly stats calculation
        // Transactions are stored as UTC midnight, so group by the UTC year/month.
        const now = new Date();
        const getMonthKey = (value) => {
            const d = new Date(value);
            return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        };

        // Prefer the current calendar month, but fall back to the most recent
        // month that has activity so the monthly cards are not empty forever.
        const currentMonthKey = getMonthKey(now);
        const monthKeys = [...incomes, ...expenses]
            .map(item => getMonthKey(item.date)).sort();
        const latestMonthKey = monthKeys.length > 0 ? monthKeys[monthKeys.length - 1] : null;
        const statsMonthKey = monthKeys.includes(currentMonthKey)
            ? currentMonthKey
            : (latestMonthKey || currentMonthKey);

        const monthlyIncomesList = incomes.filter(item => getMonthKey(item.date) === statsMonthKey);
        const monthlyExpensesList = expenses.filter(item => getMonthKey(item.date) === statsMonthKey);

        const monthlyIncome = monthlyIncomesList.reduce((acc, item) => acc + item.amount, 0);
        const monthlyExpenses = monthlyExpensesList.reduce((acc, item) => acc + item.amount, 0);
        const monthlySavings = monthlyIncome - monthlyExpenses;

        const [statsYear, statsMonth] = statsMonthKey.split('-').map(Number);
        const monthLabel = new Date(Date.UTC(statsYear, statsMonth - 1, 1))
            .toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

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

        const summary = {
            totalBalance,
            totalIncome,
            totalExpenses,
            monthlyIncome,
            monthlyExpenses,
            monthlySavings,
            monthLabel,
            savingsRate,
            todayExpenses,
            todayIncome,
            todaySavings,
            recentTransactions: combinedTransactions,
            spendingByCategory,
            incomeByCategory
        };

        // Cache the computed result per-user for the next request
        await setCache(CACHE_KEYS.SUMMARY(req.user.id), summary, SUMMARY_CACHE_TTL);

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getSummary
};
