// Expense page logic
const API_BASE = 'http://localhost:5000/api';
let currentExpenses = [];
let selectedExpenseTimePeriod = 'monthly';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Expense page initialized');

    // Initialize time filter buttons for expense chart
    const timeFilterBtns = document.querySelectorAll('.time-filter-btn-expense');
    timeFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            timeFilterBtns.forEach(b => {
                b.style.background = 'white';
                b.style.color = 'inherit';
                b.style.border = '1px solid var(--border-color)';
            });
            e.target.style.background = '#f97316';
            e.target.style.color = 'white';
            e.target.style.border = 'none';

            selectedExpenseTimePeriod = e.target.getAttribute('data-period');
            renderExpenseChart(currentExpenses);
        });
    });
    
    // Modal Elements
    const modal = document.getElementById('addExpenseModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const addExpenseForm = document.getElementById('addExpenseForm');
    const expenseDateInput = document.getElementById('expenseDate');

    // Function to set today's local date in YYYY-MM-DD format
    const setTodayDate = () => {
        if (expenseDateInput) {
            const localDate = new Date();
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            expenseDateInput.value = `${year}-${month}-${day}`;
        }
    };

    // Add Expense button functionality to open modal
    const addExpenseButtons = document.querySelectorAll('.btn-add');
    addExpenseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTodayDate();
            modal.classList.add('active');
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('active');
        addExpenseForm.reset();
    };

    // Close button event listener
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content area
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Form submission handler
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                description: document.getElementById('expenseDescription').value,
                amount: parseFloat(document.getElementById('expenseAmount').value),
                category: document.getElementById('expenseCategory').value,
                date: document.getElementById('expenseDate').value
            };

            try {
                const res = await fetch(`${API_BASE}/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    closeModal();
                    await refreshData();
                } else {
                    const err = await res.json();
                    alert(`Failed to add expense: ${err.message}`);
                }
            } catch (err) {
                console.error(err);
                alert('Server connection error. Please make sure the backend server is running.');
            }
        });
    }

    // Initial data fetch
    refreshData();
});

// Fetch and reload all database values and update UI
async function refreshData() {
    try {
        // Fetch all expenses
        const expensesRes = await fetch(`${API_BASE}/expenses`);
        const expenses = await expensesRes.json();

        // Fetch stats summary
        const statsRes = await fetch(`${API_BASE}/stats/summary`);
        const stats = await statsRes.json();

        // Update Stat Cards
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

        // Update Sub Stats Card (Middle Row)
        document.getElementById('totalExpenseVal').textContent = `$${stats.totalExpenses.toLocaleString()}`;
        
        const avgExpense = expenses.length > 0 ? (stats.totalExpenses / expenses.length) : 0;
        document.getElementById('avgExpenseVal').textContent = `$${avgExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        document.getElementById('expenseCountSubVal').innerHTML = `<i class="fa-solid fa-list-check"></i> ${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`;
        document.getElementById('expenseCountVal').textContent = expenses.length;

        // Render Expenses list
        renderExpenses(expenses);

        // Render Recent Transactions (Right sidebar)
        renderRecentTransactions(stats.recentTransactions);

        // Render Category Spend summary card
        document.getElementById('categorySpendIncome').textContent = `$${stats.totalIncome.toLocaleString()}`;
        document.getElementById('categorySpendExpense').textContent = `$${stats.totalExpenses.toLocaleString()}`;
        renderSpendingByCategory(stats.spendingByCategory);

        // Update Chart placeholder trend if we have transactions
        const chartTrend = document.getElementById('expenseChartTrend');
        if (chartTrend) {
            chartTrend.style.display = expenses.length > 0 ? 'block' : 'none';
        }

    } catch (err) {
        console.error('Error fetching data from API:', err);
    }
}

// Render dynamic expense transactions
function renderExpenses(expenses) {
    const container = document.getElementById('expenseListContainer');
    if (!container) return;

    if (expenses.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="width: 60px; height: 60px; background: #ffedd5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <i class="fa-solid fa-dollar-sign" style="font-size: 1.5rem; color: #f97316;"></i>
                </div>
                <h4 style="margin-bottom: 5px;">No expense transactions found</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">You haven't recorded any expenses yet</p>
                <button class="btn-add" style="background: #f97316; margin: 0 auto;"><i class="fa-solid fa-plus"></i> Add Expense</button>
            </div>
        `;
        // Re-attach modal trigger for the button inside the empty state
        container.querySelector('.btn-add').addEventListener('click', () => {
            const modal = document.getElementById('addExpenseModal');
            const setTodayDate = () => {
                const expenseDateInput = document.getElementById('expenseDate');
                if (expenseDateInput) {
                    const localDate = new Date();
                    const year = localDate.getFullYear();
                    const month = String(localDate.getMonth() + 1).padStart(2, '0');
                    const day = String(localDate.getDate()).padStart(2, '0');
                    expenseDateInput.value = `${year}-${month}-${day}`;
                }
            };
            setTodayDate();
            modal.classList.add('active');
        });
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
            day: 'numeric',
            year: 'numeric'
        });

        html += `
            <li class="transaction-item" style="justify-content: space-between; display: flex; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <div class="item-icon" style="background: #ffedd5; color: #f97316;">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <div class="item-info">
                        <p style="text-align: left; margin: 0;">${item.description}</p>
                        <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-align: left;">${item.category} • ${formattedDate}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="item-amount minus">-$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button class="btn-delete-item" data-id="${item._id}" style="background: none; border: none; color: #cbd5e1; cursor: pointer; transition: color 0.2s;"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;

    // Attach delete listeners
    container.querySelectorAll('.btn-delete-item').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this expense?')) {
                await deleteExpense(id);
            }
        });
        btn.addEventListener('mouseenter', () => btn.style.color = '#ef4444');
        btn.addEventListener('mouseleave', () => btn.style.color = '#cbd5e1');
    });
}

// Delete an expense
async function deleteExpense(id) {
    try {
        const res = await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            await refreshData();
        } else {
            alert('Failed to delete expense');
        }
    } catch (err) {
        console.error(err);
    }
}

// Render dynamic recent transactions list
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

// Render expense categories breakdown
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
