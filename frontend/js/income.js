// Income page logic
const API_BASE = 'http://localhost:5000/api';
let currentIncomes = [];
let selectedTimePeriod = 'monthly';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Income page initialized');

    // Initialize time filter buttons
    const timeFilterBtns = document.querySelectorAll('.time-filter-btn');
    timeFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            timeFilterBtns.forEach(b => {
                b.style.background = 'white';
                b.style.color = 'inherit';
                b.style.border = '1px solid var(--border-color)';
            });
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
            e.target.style.border = 'none';

            selectedTimePeriod = e.target.getAttribute('data-period');
            renderChart(currentIncomes);
        });
    });
    
    // Modal Elements
    const modal = document.getElementById('addIncomeModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const addIncomeForm = document.getElementById('addIncomeForm');
    const incomeDateInput = document.getElementById('incomeDate');

    // Function to set today's local date in YYYY-MM-DD format
    const setTodayDate = () => {
        if (incomeDateInput) {
            const localDate = new Date();
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            incomeDateInput.value = `${year}-${month}-${day}`;
        }
    };

    // Add Income button functionality to open modal
    const addIncomeButtons = document.querySelectorAll('.btn-add');
    addIncomeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTodayDate();
            modal.classList.add('active');
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('active');
        addIncomeForm.reset();
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
    if (addIncomeForm) {
        addIncomeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                description: document.getElementById('incomeDescription').value,
                amount: parseFloat(document.getElementById('incomeAmount').value),
                category: document.getElementById('incomeCategory').value,
                date: document.getElementById('incomeDate').value
            };

            try {
                const res = await fetch(`${API_BASE}/incomes`, {
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
                    alert(`Failed to add income: ${err.message}`);
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
        // Fetch all incomes
        const incomesRes = await fetch(`${API_BASE}/incomes`);
        const incomes = await incomesRes.json();
        currentIncomes = incomes;

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
        document.getElementById('totalIncomeVal').textContent = `$${stats.totalIncome.toLocaleString()}`;
        
        const avgIncome = incomes.length > 0 ? (stats.totalIncome / incomes.length) : 0;
        document.getElementById('avgIncomeVal').textContent = `$${avgIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        document.getElementById('incomeCountSubVal').innerHTML = `<i class="fa-solid fa-list-check"></i> ${incomes.length} transaction${incomes.length !== 1 ? 's' : ''}`;
        document.getElementById('incomeCountVal').textContent = incomes.length;

        // Render Incomes list
        renderIncomes(incomes);

        // Render Recent Transactions (Right sidebar)
        renderRecentTransactions(stats.recentTransactions);

        // Render Category Spend summary card
        document.getElementById('categorySpendIncome').textContent = `$${stats.totalIncome.toLocaleString()}`;
        document.getElementById('categorySpendExpense').textContent = `$${stats.totalExpenses.toLocaleString()}`;
        renderIncomeByCategory(stats.incomeByCategory);

        // Update Chart placeholder trend if we have transactions
        const chartTrend = document.getElementById('incomeChartTrend');
        if (chartTrend) {
            chartTrend.style.display = incomes.length > 0 ? 'block' : 'none';
        }

        // Render the chart based on selected time period
        renderChart(incomes);

    } catch (err) {
        console.error('Error fetching data from API:', err);
    }
}

// Render dynamic income transactions
function renderIncomes(incomes) {
    const container = document.getElementById('incomeListContainer');
    if (!container) return;

    if (incomes.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <i class="fa-solid fa-dollar-sign" style="font-size: 1.5rem; color: #10b981;"></i>
                </div>
                <h4 style="margin-bottom: 5px;">No income transactions found</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">You haven't recorded any income yet</p>
                <button class="btn-add" style="background: #10b981; margin: 0 auto;"><i class="fa-solid fa-plus"></i> Add Income</button>
            </div>
        `;
        // Re-attach modal trigger for the button inside the empty state
        container.querySelector('.btn-add').addEventListener('click', () => {
            const modal = document.getElementById('addIncomeModal');
            const setTodayDate = () => {
                const incomeDateInput = document.getElementById('incomeDate');
                if (incomeDateInput) {
                    const localDate = new Date();
                    const year = localDate.getFullYear();
                    const month = String(localDate.getMonth() + 1).padStart(2, '0');
                    const day = String(localDate.getDate()).padStart(2, '0');
                    incomeDateInput.value = `${year}-${month}-${day}`;
                }
            };
            setTodayDate();
            modal.classList.add('active');
        });
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
            day: 'numeric',
            year: 'numeric'
        });

        html += `
            <li class="transaction-item" style="justify-content: space-between; display: flex; align-items: center; width: 100%;">
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <div class="item-icon" style="background: #e6f9f7; color: #00bfae;">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <div class="item-info">
                        <p style="text-align: left; margin: 0;">${item.description}</p>
                        <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-align: left;">${item.category} • ${formattedDate}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="item-amount plus">+$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
            if (confirm('Are you sure you want to delete this income?')) {
                await deleteIncome(id);
            }
        });
        btn.addEventListener('mouseenter', () => btn.style.color = '#ef4444');
        btn.addEventListener('mouseleave', () => btn.style.color = '#cbd5e1');
    });
}

// Delete an income
async function deleteIncome(id) {
    try {
        const res = await fetch(`${API_BASE}/incomes/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            await refreshData();
        } else {
            alert('Failed to delete income');
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

// Render income categories breakdown
function renderIncomeByCategory(incomeMap) {
    const container = document.getElementById('categoryListContainer');
    if (!container) return;

    const categories = Object.keys(incomeMap);
    if (categories.length === 0) {
        container.innerHTML = 'No data to display';
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 10px; text-align: left; margin-top: 10px;">';
    categories.forEach(cat => {
        const amt = incomeMap[cat];
        html += `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 5px 0; border-bottom: 1px solid var(--border-color);">
                <span>${cat}</span>
                <span style="font-weight: 600; color: #10b981;">$${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Aggregate income data by selected time period
function aggregateIncomeByPeriod(incomes, period) {
    const data = {};
    const today = new Date();

    incomes.forEach(income => {
        const date = new Date(income.date);
        let key;

        if (period === 'daily') {
            // Show last 7 days
            const dayDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            if (dayDiff <= 6) {
                key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        } else if (period === 'weekly') {
            // Show last 4 weeks
            const weekDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
            if (weekDiff <= 3) {
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay());
                key = `Week ${Math.floor((today - startOfWeek) / (1000 * 60 * 60 * 24 * 7)) + 1}`;
            }
        } else if (period === 'monthly') {
            // Show all months
            key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else if (period === 'yearly') {
            // Show all years
            key = date.getFullYear().toString();
        }

        if (key) {
            data[key] = (data[key] || 0) + income.amount;
        }
    });

    return data;
}

// Render chart on canvas
function renderChart(incomes) {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) return;

    if (incomes.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const aggregatedData = aggregateIncomeByPeriod(incomes, selectedTimePeriod);
    const labels = Object.keys(aggregatedData);
    const amounts = Object.values(aggregatedData);

    if (labels.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const maxAmount = Math.max(...amounts);
    const padding = 60;
    const barWidth = Math.max(30, (canvas.width - padding * 2) / labels.length - 5);
    const chartHeight = canvas.height - padding * 2;

    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw Y-axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const amount = (maxAmount / 4) * i;
        const y = padding + chartHeight - (chartHeight / 4) * i;
        ctx.fillText(`$${Math.round(amount / 1000)}K`, padding - 10, y + 4);
    }

    // Draw bars
    ctx.fillStyle = '#10b981';
    labels.forEach((label, index) => {
        const x = padding + (index * (barWidth + 5)) + 2.5;
        const barHeight = (amounts[index] / maxAmount) * chartHeight;
        const y = padding + chartHeight - barHeight;

        ctx.fillRect(x, y, barWidth, barHeight);
    });

    // Draw X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
        const x = padding + (index * (barWidth + 5)) + barWidth / 2 + 2.5;
        ctx.save();
        ctx.translate(x, canvas.height - 20);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(label, 0, 0);
        ctx.restore();
    });

    // Update chart title
    const chartTitleEl = document.getElementById('chartTitle');
    if (chartTitleEl) {
        const periodNames = {
            'daily': 'Daily Income Trends',
            'weekly': 'Weekly Income Trends',
            'monthly': 'Monthly Income Trends',
            'yearly': 'Yearly Income Trends'
        };
        chartTitleEl.textContent = periodNames[selectedTimePeriod];
    }
}
