import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const ExpenseView = ({
  expenses = [],
  stats = {},
  onAddExpense,
  onDeleteExpense,
  refreshData,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Groceries',
    date: '',
  });

  // Set today's date on modal open
  useEffect(() => {
    if (isModalOpen) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData((prev) => ({
        ...prev,
        date: `${yyyy}-${mm}-${dd}`,
      }));
    }
  }, [isModalOpen]);

  const totalExpenseVal = stats.totalExpenses || 0;
  const avgExpenseVal = expenses.length > 0 ? totalExpenseVal / expenses.length : 0;
  const expenseCountVal = expenses.length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill out all fields.');
      return;
    }
    const success = await onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    if (success) {
      setIsModalOpen(false);
      setFormData({
        description: '',
        amount: '',
        category: 'Groceries',
        date: '',
      });
    }
  };

  // Helper for icons based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Groceries':
        return 'fa-cart-shopping';
      case 'Rent':
        return 'fa-house';
      case 'Utilities':
        return 'fa-bolt';
      case 'Entertainment':
        return 'fa-gamepad';
      default:
        return 'fa-credit-card';
    }
  };

  // Aggregate expense data
  const aggregateData = () => {
    const dataMap = {};
    const today = new Date();

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      let key = null;

      if (selectedPeriod === 'daily') {
        const dayDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 6) {
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      } else if (selectedPeriod === 'weekly') {
        const weekDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
        if (weekDiff <= 3) {
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = `Week ${Math.floor((today - startOfWeek) / (1000 * 60 * 60 * 24 * 7)) + 1}`;
        }
      } else if (selectedPeriod === 'monthly') {
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else if (selectedPeriod === 'yearly') {
        key = date.getFullYear().toString();
      }

      if (key) {
        dataMap[key] = (dataMap[key] || 0) + expense.amount;
      }
    });

    return dataMap;
  };

  const aggregated = aggregateData();
  const labels = Object.keys(aggregated);
  const amounts = Object.values(aggregated);

  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'daily':
        return 'Daily Expense Trends';
      case 'weekly':
        return 'Weekly Expense Trends';
      case 'monthly':
        return 'Monthly Expense Trends';
      case 'yearly':
        return 'Yearly Expense Trends';
      default:
        return 'Expense Trends';
    }
  };

  const chartData = {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [
      {
        label: 'Expenses ($)',
        data: amounts.length > 0 ? amounts : [0],
        backgroundColor: '#f97316',
        borderRadius: 6,
        maxBarThickness: 45,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: getChartTitle(),
        font: {
          size: 14,
          weight: '600',
          family: 'Inter, sans-serif',
        },
        color: '#334155',
        align: 'start',
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(249, 115, 22, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `$${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Hero Card */}
        <div className="p-6 rounded-xl border border-[#cbd5e1] bg-white flex justify-between items-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div>
            <h2 className="text-xl font-bold text-[#334155] mb-1">Expense Overview</h2>
            <p className="text-sm text-[#64748b]">Track and manage your expenses</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#f97316] hover:bg-[#e05600] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <i className="fa-solid fa-plus text-xs"></i> Add Expense
          </button>
        </div>

        {/* Sub Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#fed7aa]">
            <p className="text-xs text-[#64748b] flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-dollar-sign text-[#f97316]"></i> Total Expenses
            </p>
            <p className="text-xl font-bold text-[#334155]">${totalExpenseVal.toLocaleString()}</p>
            <p className="text-[10px] text-[#64748b] mt-1">
              <i className="fa-regular fa-calendar"></i> Today
            </p>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#fde68a]">
            <p className="text-xs text-[#64748b] flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-chart-column text-[#fbbf24]"></i> Average Expense
            </p>
            <p className="text-xl font-bold text-[#334155]">
              ${avgExpenseVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-[#64748b] mt-1">
              <i className="fa-solid fa-list-check"></i> {expenseCountVal} transaction{expenseCountVal !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#fde68a]">
            <p className="text-xs text-[#64748b] flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-arrow-trend-up text-[#fbbf24]"></i> Transactions
            </p>
            <p className="text-xl font-bold text-[#334155]">{expenseCountVal}</p>
            <p className="text-[10px] text-[#64748b] mt-1">
              <i className="fa-solid fa-globe"></i> All records
            </p>
          </div>
        </div>

        {/* Trends Chart Card */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-chart-bar text-[#f97316]"></i> Expense Analysis
            </h3>
            {/* Filter Buttons */}
            <div className="flex bg-[#f1f5f9] p-1 rounded-lg gap-1">
              {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`text-xs font-semibold px-3 py-1 rounded-md capitalize transition-all cursor-pointer ${
                    selectedPeriod === period
                      ? 'bg-[#f97316] text-white shadow-sm'
                      : 'text-[#64748b] hover:text-[#334155]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[250px] relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Expense Transactions List */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-dollar-sign text-[#f97316]"></i> Expense Transactions
            </h3>
            <span className="bg-[#fee2e2] text-[#991b1b] px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
              {expenses.length} records
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#ffedd5] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-dollar-sign text-[#f97316] text-2xl"></i>
              </div>
              <h4 className="font-bold text-base text-[#334155] mb-1">No expense transactions found</h4>
              <p className="text-sm text-[#64748b] mb-5">You haven't recorded any expenses yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-medium mx-auto flex items-center gap-2 hover:opacity-90 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-xs"></i> Add Expense
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9]">
              {expenses.map((item) => (
                <li key={item._id} className="py-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#f97316] flex items-center justify-center text-sm font-semibold">
                      <i className={`fa-solid ${getCategoryIcon(item.category)}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#334155]">{item.description}</p>
                      <span className="text-xs text-[#64748b]">
                        {item.category} •{' '}
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#ef4444]">
                      -${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this expense?')) {
                          onDeleteExpense(item._id);
                        }
                      }}
                      className="text-[#cbd5e1] hover:text-[#ef4444] transition-colors duration-200 cursor-pointer"
                    >
                      <i className="fa-regular fa-trash-can text-base"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[#64748b]"></i> Recent Transactions
            </h3>
            <button
              onClick={refreshData}
              className="text-[#64748b] hover:text-[#00bfae] cursor-pointer"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className="bg-[#f1f5f9] p-2.5 rounded-lg text-[10px] text-[#475569] mb-4 flex items-center gap-1.5 font-medium">
            <i className="fa-solid fa-info-circle"></i> Transactions are stacked by date (newest first)
          </div>

          {(stats.recentTransactions || []).length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-clock text-[#cbd5e1] text-lg"></i>
              </div>
              <p className="text-sm text-[#64748b]">No recent transactions</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9] max-h-[350px] overflow-y-auto pr-1">
              {(stats.recentTransactions || []).map((item) => {
                const isExpense = item.type === 'expense';
                return (
                  <li key={item._id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isExpense ? 'bg-[#ffedd5] text-[#f97316]' : 'bg-[#e6f9f7] text-[#00bfae]'
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            isExpense
                              ? getCategoryIcon(item.category)
                              : item.category === 'Salary'
                              ? 'fa-money-bill-wave'
                              : item.category === 'Freelance'
                              ? 'fa-laptop-code'
                              : item.category === 'Investments'
                              ? 'fa-chart-line'
                              : 'fa-dollar-sign'
                          }`}
                        ></i>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#334155] leading-tight truncate max-w-[120px]">{item.description}</p>
                        <span className="text-[10px] text-[#64748b]">
                          {item.category} •{' '}
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${isExpense ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                      {isExpense ? '-' : '+'}${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Spending by Category */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-[#f97316]"></i> Spending by Category
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-[#f0f9ff] p-2.5 rounded-lg text-center">
              <p className="text-[9px] text-[#64748b] font-medium font-semibold">Total Income</p>
              <p className="text-sm font-bold text-[#0ea5e9]">${(stats.totalIncome || 0).toLocaleString()}</p>
            </div>
            <div className="bg-[#fffbeb] p-2.5 rounded-lg text-center">
              <p className="text-[9px] text-[#64748b] font-medium font-semibold">Total Expenses</p>
              <p className="text-sm font-bold text-[#f59e0b]">${totalExpenseVal.toLocaleString()}</p>
            </div>
          </div>

          {Object.keys(stats.spendingByCategory || {}).length === 0 ? (
            <div className="text-center py-6 text-xs text-[#64748b]">No data to display</div>
          ) : (
            <div className="flex flex-col gap-2.5 mt-2">
              {Object.entries(stats.spendingByCategory || {}).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between items-center text-xs py-2 border-b border-[#f1f5f9] last:border-0">
                  <span className="font-medium text-[#475569]">{cat}</span>
                  <span className="font-semibold text-[#f97316]">
                    ${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-[4px] flex items-center justify-center z-[1000] p-4 transition-opacity duration-300">
          <div className="bg-white w-full max-w-[440px] rounded-2xl p-7 shadow-2xl transform translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-[#1e293b]">Add New Expense</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748b] hover:text-[#334155] w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="expenseDescription" className="text-xs font-semibold text-[#334155]">
                  Description
                </label>
                <input
                  type="text"
                  id="expenseDescription"
                  name="description"
                  placeholder="e.g. Groceries, rent"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#cbd5e1] rounded-lg text-sm text-[#334155] focus:border-[#f97316] focus:ring-3 focus:ring-[#f97316]/15 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expenseAmount" className="text-xs font-semibold text-[#334155]">
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="expenseAmount"
                  name="amount"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#cbd5e1] rounded-lg text-sm text-[#334155] focus:border-[#f97316] focus:ring-3 focus:ring-[#f97316]/15 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expenseCategory" className="text-xs font-semibold text-[#334155]">
                  Category
                </label>
                <select
                  id="expenseCategory"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#cbd5e1] rounded-lg text-sm text-[#334155] bg-white focus:border-[#f97316] focus:ring-3 focus:ring-[#f97316]/15 outline-none transition-all"
                  required
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expenseDate" className="text-xs font-semibold text-[#334155]">
                  Date
                </label>
                <input
                  type="date"
                  id="expenseDate"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#cbd5e1] rounded-lg text-sm text-[#334155] focus:border-[#f97316] focus:ring-3 focus:ring-[#f97316]/15 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#e05600] text-white py-3 rounded-lg text-sm font-semibold cursor-pointer shadow-md transition-all active:scale-[0.98]"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
