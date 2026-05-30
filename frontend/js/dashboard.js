// Dashboard logic
const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    
    // Initial data load
    refreshDashboard();

    // Attach refresh button listener
    const refreshBtn = document.getElementById('refreshStatsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Add spin animation to the refresh icon temporarily
            refreshBtn.classList.add('fa-spin');
            refreshDashboard().finally(() => {
                setTimeout(() => {
                    refreshBtn.classList.remove('fa-spin');
                }, 500);
            });
        });
    }
});

// Fetch metrics and update dashboard elements
async function refreshDashboard() {
    try {
        // Fetch stats summary
        const statsRes = await fetch(`${API_BASE}/stats/summary`);
        const stats = await statsRes.json();

        // Fetch direct incomes and expenses lists
        const incomesRes = await fetch(`${API_BASE}/incomes`);
        const incomes = await incomesRes.json();

        const expensesRes = await fetch(`${API_BASE}/expenses`);
        const expenses = await expensesRes.json();

        // 1. Update Top Summary Cards
        document.getElementById('totalBalanceVal').textContent = `$${stats.totalBalance.toLocaleString()}`;
        document.getElementById('monthlyIncomeVal').textContent = `$${stats.monthlyIncome.toLocaleString()}`;
        document.getElementById('monthlyExpensesVal').textContent = `$${stats.monthlyExpenses.toLocaleString()}`;
        
        const savingsRateEl = document.getElementById('savingsRateVal');
        savingsRateEl.textContent = `${stats.savingsRate}%`;
        const savingsRateText = savingsRateEl.nextElementSibling;
        if (stats.savingsRate >= 50) {
            savingsRateText.textContent = 'Excellent savings';
            savingsRateText.style.color = '#10b981';
        } else if (stats.savingsRate >= 20) {
            savingsRateText.textContent = 'Good progress';
            savingsRateText.style.color = '#3b82f6';
        } else {
            savingsRateText.textContent = 'Needs improvement';
            savingsRateText.style.color = '#6366f1';
        }

        // 2. Update Middle Row Sub Stats
        document.getElementById('subTotalBalanceVal').textContent = `$${stats.totalBalance.toLocaleString()}`;
        document.getElementById('subBalanceBreakdown').textContent = `+${stats.totalIncome.toLocaleString()} (Inc) / -${stats.totalExpenses.toLocaleString()} (Exp)`;

        document.getElementById('subTodayExpensesVal').textContent = `$${stats.todayExpenses.toLocaleString()}`;
        
        document.getElementById('subTodaySavingsVal').textContent = `$${stats.todaySavings.toLocaleString()}`;
        const todaySavingsPercent = stats.todayIncome > 0 ? Math.round((stats.todaySavings / stats.todayIncome) * 100) : 0;
        document.getElementById('subTodaySavingsPercent').textContent = `${todaySavingsPercent}% of today's income`;

        // 3. Update Category Breakdown Card
        document.getElementById('categorySpendIncome').textContent = `$${stats.totalIncome.toLocaleString()}`;
        document.getElementById('categorySpendExpense').textContent = `$${stats.totalExpenses.toLocaleString()}`;
        renderSpendingByCategory(stats.spendingByCategory);

        // 4. Render lists
        renderRecentIncome(incomes.slice(0, 5));
        renderRecentExpenses(expenses.slice(0, 5));
        renderRecentTransactions(stats.recentTransactions);

    } catch (err) {
        console.error('Error refreshing dashboard data:', err);
    }
}

// Render recent incomes list on dashboard
function renderRecentIncome(incomes) {
    const container = document.getElementById('recentIncomeContainer');
    const countTag = document.getElementById('recentIncomeCountTag');
    if (!container) return;

    if (countTag) {
        countTag.textContent = `${incomes.length} record${incomes.length !== 1 ? 's' : ''}`;
    }

    if (incomes.length === 0) {
        container.innerHTML = `
            <i class="fa-solid fa-dollar-sign" style="font-size: 2rem; color: #dcfce7; margin-bottom: 10px;"></i>
            <p style="color: var(--text-muted); font-size: 0.9rem;">No income transactions</p>
        `;
        return;
    }

    let html = '<ul class="transaction-list">';
    incomes.forEach(item => {
        let iconClass = 'fa-dollar-sign';
        if (item.category === 'Salary') iconClass = 'fa-money-bill-wave';
        else if (item.category === 'Freelance') iconClass = 'fa-laptop-code';
        else if (item.category === 'Investments') iconClass = 'fa-chart-line';

        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        html += `
            <li class="transaction-item" style="justify-content: space-between; display: flex; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <div class="item-icon" style="background: #e6f9f7; color: #00bfae; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid ${iconClass}" style="font-size: 0.9rem;"></i>
                    </div>
                    <div class="item-info">
                        <p style="text-align: left; margin: 0; font-size: 0.85rem; font-weight: 500;">${item.description}</p>
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-align: left;">${item.category} • ${formattedDate}</span>
                    </div>
                </div>
                <span class="item-amount plus" style="font-size: 0.85rem; font-weight: 600;">+$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Render recent expenses list on dashboard
function renderRecentExpenses(expenses) {
    const container = document.getElementById('recentExpenseContainer');
    const countTag = document.getElementById('recentExpenseCountTag');
    if (!container) return;

    if (countTag) {
        countTag.textContent = `${expenses.length} record${expenses.length !== 1 ? 's' : ''}`;
    }

    if (expenses.length === 0) {
        container.innerHTML = `
            <i class="fa-solid fa-cart-shopping" style="font-size: 2rem; color: #fee2e2; margin-bottom: 10px;"></i>
            <p style="color: var(--text-muted); font-size: 0.9rem;">No expense transactions</p>
        `;
        return;
    }

    let html = '<ul class="transaction-list">';
    expenses.forEach(item => {
        let iconClass = 'fa-credit-card';
        if (item.category === 'Groceries') iconClass = 'fa-cart-shopping';
        else if (item.category === 'Rent') iconClass = 'fa-house';
        else if (item.category === 'Utilities') iconClass = 'fa-bolt';
        else if (item.category === 'Entertainment') iconClass = 'fa-gamepad';

        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        html += `
            <li class="transaction-item" style="justify-content: space-between; display: flex; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <div class="item-icon" style="background: #ffedd5; color: #f97316; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid ${iconClass}" style="font-size: 0.9rem;"></i>
                    </div>
                    <div class="item-info">
                        <p style="text-align: left; margin: 0; font-size: 0.85rem; font-weight: 500;">${item.description}</p>
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-align: left;">${item.category} • ${formattedDate}</span>
                    </div>
                </div>
                <span class="item-amount minus" style="font-size: 0.85rem; font-weight: 600;">-$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Render dynamic recent transactions list (combined history)
function renderRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactionsContainer');
    if (!container) return;

    if (transactions.length === 0) {
        container.innerHTML = `
            <div style="width: 55px; height: 55px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <i class="fa-solid fa-clock" style="color: #cbd5e1; font-size: 1.25rem;"></i>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">No recent transactions</p>
        `;
        return;
    }

    let html = '<ul class="transaction-list">';
    transactions.forEach(item => {
        let iconClass = 'fa-dollar-sign';
        let bgStyle = 'background: #e6f9f7; color: #00bfae;'; // income
        let signClass = 'plus';
        let sign = '+';

        if (item.type === 'expense') {
            bgStyle = 'background: #ffedd5; color: #f97316;'; // expense
            signClass = 'minus';
            sign = '-';
            
            if (item.category === 'Groceries') iconClass = 'fa-cart-shopping';
            else if (item.category === 'Rent') iconClass = 'fa-house';
            else if (item.category === 'Utilities') iconClass = 'fa-bolt';
            else if (item.category === 'Entertainment') iconClass = 'fa-gamepad';
            else iconClass = 'fa-credit-card';
        } else {
            if (item.category === 'Salary') iconClass = 'fa-money-bill-wave';
            else if (item.category === 'Freelance') iconClass = 'fa-laptop-code';
            else if (item.category === 'Investments') iconClass = 'fa-chart-line';
        }

        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        html += `
            <li class="transaction-item" style="justify-content: space-between; display: flex; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <div class="item-icon" style="${bgStyle} width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid ${iconClass}" style="font-size: 0.9rem;"></i>
                    </div>
                    <div class="item-info">
                        <p style="text-align: left; margin: 0; font-size: 0.85rem; font-weight: 500;">${item.description}</p>
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block; text-align: left;">${item.category} • ${formattedDate}</span>
                    </div>
                </div>
                <span class="item-amount ${signClass}" style="font-size: 0.85rem; font-weight: 600;">${sign}$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Render dynamic categories breakdown
function renderSpendingByCategory(spendingMap) {
    const container = document.getElementById('categoryListContainer');
    if (!container) return;

    const categories = Object.keys(spendingMap);
    if (categories.length === 0) {
        container.innerHTML = 'No data to display';
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 10px; text-align: left; margin-top: 10px;">';
    categories.forEach(cat => {
        const amt = spendingMap[cat];
        html += `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 5px 0; border-bottom: 1px solid var(--border-color);">
                <span>${cat}</span>
                <span style="font-weight: 600; color: #f97316;">$${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}
