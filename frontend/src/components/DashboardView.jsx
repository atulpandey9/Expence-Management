import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardView = ({ stats = {}, incomes = [], expenses = [], refreshData }) => {
  const totalIncome = stats.totalIncome || 0;
  const totalExpenses = stats.totalExpenses || 0;
  const totalBalance = stats.totalBalance || 0;
  const todayExpenses = stats.todayExpenses || 0;
  const todayIncome = stats.todayIncome || 0;
  const todaySavings = stats.todaySavings || 0;
  const recentTransactions = stats.recentTransactions || [];
  const spendingByCategory = stats.spendingByCategory || {};
  const incomeByCategory = stats.incomeByCategory || {};

  const todaySavingsPercent = todayIncome > 0 ? Math.round((todaySavings / todayIncome) * 100) : 0;

  // Chart data configuration
  const chartData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        data: [totalIncome, totalExpenses, Math.max(totalIncome - totalExpenses, 0)],
        backgroundColor: [
          '#10b981', // Green
          '#f97316', // Orange
          '#3b82f6', // Blue
        ],
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 13,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: $${context.raw.toLocaleString()}`;
          },
        },
      },
    },
  };

  // Helper for icons based on category
  const getCategoryIcon = (category, type) => {
    if (type === 'income') {
      switch (category) {
        case 'Salary':
          return 'fa-money-bill-wave';
        case 'Freelance':
          return 'fa-laptop-code';
        case 'Investments':
          return 'fa-chart-line';
        default:
          return 'fa-dollar-sign';
      }
    } else {
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
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* Left Column (takes 2 cols on lg screens) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Hero Card */}
        <div className="p-6 rounded-xl border border-[#bae6fd] bg-gradient-to-br from-[#e0f2ff] to-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0369a1] mb-1">Finance Dashboard</h2>
            <p className="text-sm text-[#0c4a6e]">Track your income and expenses with real-time stats.</p>
          </div>
        </div>

        {/* Sub Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#f8fafc] p-4 rounded-xl text-center border border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] flex items-center justify-center gap-1.5 mb-1">
              <i className="fa-solid fa-wallet text-[#00bfae]"></i> Total Balance
            </p>
            <p className="text-lg font-bold text-[#334155]">${totalBalance.toLocaleString()}</p>
            <p className="text-[10px] text-[#00bfae] font-semibold mt-1">
              +{totalIncome.toLocaleString()} (Inc) / -{totalExpenses.toLocaleString()} (Exp)
            </p>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl text-center border border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] flex items-center justify-center gap-1.5 mb-1">
              <i className="fa-solid fa-arrow-down text-[#f97316]"></i> Today Expenses
            </p>
            <p className="text-lg font-bold text-[#334155]">${todayExpenses.toLocaleString()}</p>
            <p className="text-[10px] text-[#f97316] font-semibold mt-1">Today's spending</p>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl text-center border border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] flex items-center justify-center gap-1.5 mb-1">
              <i className="fa-solid fa-piggy-bank text-[#0ea5e9]"></i> Today Savings
            </p>
            <p className="text-lg font-bold text-[#334155]">${todaySavings.toLocaleString()}</p>
            <p className="text-[10px] text-[#0ea5e9] font-semibold mt-1">{todaySavingsPercent}% of today's income</p>
          </div>
        </div>

        {/* Financial Doughnut Chart */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 mb-4 border-b border-[#f1f5f9] pb-3">
            <i className="fa-solid fa-chart-pie text-[#00bfae]"></i>
            <h3 className="font-semibold text-[#334155]">Financial Overview</h3>
          </div>
          <div className="h-[260px] relative">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Incomes (slice 5) */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-[#22c55e]"></i> Recent Income
              <span className="font-normal text-xs text-[#64748b]">(All time)</span>
            </h3>
            <span className="bg-[#dcfce7] text-[#166534] px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
              {incomes.length} records
            </span>
          </div>

          {incomes.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-dollar-sign text-4xl text-[#dcfce7] mb-2.5"></i>
              <p className="text-sm text-[#64748b]">No income transactions recorded yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9]">
              {incomes.slice(0, 5).map((item) => (
                <li key={item._id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#e6f9f7] text-[#00bfae] flex items-center justify-center">
                      <i className={`fa-solid ${getCategoryIcon(item.category, 'income')}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#334155]">{item.description}</p>
                      <span className="text-xs text-[#64748b]">
                        {item.category} • {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#22c55e]">
                    +${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Expenses (slice 5) */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-arrow-trend-down text-[#f97316]"></i> Recent Expenses
              <span className="font-normal text-xs text-[#64748b]">(All time)</span>
            </h3>
            <span className="bg-[#fee2e2] text-[#991b1b] px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
              {expenses.length} records
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-cart-shopping text-4xl text-[#fee2e2] mb-2.5"></i>
              <p className="text-sm text-[#64748b]">No expense transactions recorded yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9]">
              {expenses.slice(0, 5).map((item) => (
                <li key={item._id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#ffedd5] text-[#f97316] flex items-center justify-center">
                      <i className={`fa-solid ${getCategoryIcon(item.category, 'expense')}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#334155]">{item.description}</p>
                      <span className="text-xs text-[#64748b]">
                        {item.category} • {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#ef4444]">
                    -${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Column - Side Panels */}
      <div className="space-y-6">
        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[#64748b]"></i> Recent Transactions
            </h3>
            <button
              onClick={refreshData}
              className="text-[#64748b] hover:text-[#00bfae] cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className="bg-[#f1f5f9] p-2.5 rounded-lg text-[10px] text-[#475569] mb-4 flex items-center gap-1.5 font-medium">
            <i className="fa-solid fa-info-circle"></i> Transactions are stacked by date (newest first)
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-clock text-[#cbd5e1] text-lg"></i>
              </div>
              <p className="text-sm text-[#64748b]">No recent transactions</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#f1f5f9] max-h-[380px] overflow-y-auto pr-1">
              {recentTransactions.map((item) => {
                const isExpense = item.type === 'expense';
                return (
                  <li key={item._id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isExpense ? 'bg-[#ffedd5] text-[#f97316]' : 'bg-[#e6f9f7] text-[#00bfae]'
                        }`}
                      >
                        <i className={`fa-solid ${getCategoryIcon(item.category, item.type)}`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#334155] leading-tight truncate max-w-[120px]">{item.description}</p>
                        <span className="text-[10px] text-[#64748b]">
                          {item.category} • {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

        {/* Spending by Category Card */}
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#f1f5f9] pb-3">
            <h3 className="font-semibold text-[#334155] flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-[#f97316]"></i> Spending by Category
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-[#f0f9ff] p-2.5 rounded-lg text-center">
              <p className="text-[9px] text-[#64748b] font-medium">Total Income</p>
              <p className="text-sm font-bold text-[#0ea5e9]">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-[#fffbeb] p-2.5 rounded-lg text-center">
              <p className="text-[9px] text-[#64748b] font-medium">Total Expenses</p>
              <p className="text-sm font-bold text-[#f59e0b]">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>

          {Object.keys(spendingByCategory).length === 0 ? (
            <div className="text-center py-6 text-xs text-[#64748b]">No data to display</div>
          ) : (
            <div className="flex flex-col gap-2.5 mt-2">
              {Object.entries(spendingByCategory).map(([cat, amt]) => (
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
    </div>
  );
};

export default DashboardView;
