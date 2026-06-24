import React from 'react';

const StatsSummary = ({ stats = {} }) => {
  const totalBalance = stats.totalBalance || 0;
  const monthlyIncome = stats.monthlyIncome || 0;
  const monthlyExpenses = stats.monthlyExpenses || 0;
  const savingsRate = stats.savingsRate || 0;

  const getSavingsRateStyles = (rate) => {
    if (rate >= 50) {
      return { text: 'Excellent savings', colorClass: 'text-[#10b981]' };
    } else if (rate >= 20) {
      return { text: 'Good progress', colorClass: 'text-[#3b82f6]' };
    } else {
      return { text: 'Needs improvement', colorClass: 'text-[#6366f1]' };
    }
  };

  const savingsRateInfo = getSavingsRateStyles(savingsRate);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
      {/* Total Balance Card */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-[#e2e8f0] flex justify-between items-start">
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] mb-2 uppercase tracking-wider">Total Balance</h3>
          <p className="text-2xl font-bold text-[#334155]">${totalBalance.toLocaleString()}</p>
          <p className="text-[10px] text-[#64748b] mt-1.5 font-medium">
            +0.0% <span className="text-[#94a3b8]">this month</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-lg">
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div>

      {/* Monthly Income Card */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-[#e2e8f0] flex justify-between items-start">
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] mb-2 uppercase tracking-wider">Monthly Income</h3>
          <p className="text-2xl font-bold text-[#334155]">${monthlyIncome.toLocaleString()}</p>
          <p className="text-[10px] text-[#10b981] mt-1.5 font-medium">
            +12.5% <span className="text-[#94a3b8]">from last month</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#dcfce7] text-[#22c55e] flex items-center justify-center text-lg">
          <i className="fa-solid fa-arrow-up"></i>
        </div>
      </div>

      {/* Monthly Expenses Card */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-[#e2e8f0] flex justify-between items-start">
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] mb-2 uppercase tracking-wider">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-[#334155]">${monthlyExpenses.toLocaleString()}</p>
          <p className="text-[10px] text-[#f59e0b] mt-1.5 font-medium">
            -0% <span className="text-[#94a3b8]">from last month</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#ffedd5] text-[#f97316] flex items-center justify-center text-lg">
          <i className="fa-solid fa-arrow-down"></i>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-[#e2e8f0] flex justify-between items-start">
        <div>
          <h3 className="text-xs font-semibold text-[#64748b] mb-2 uppercase tracking-wider">Savings Rate</h3>
          <p className="text-2xl font-bold text-[#334155]">{savingsRate}%</p>
          <p className={`text-[10px] font-semibold mt-1.5 ${savingsRateInfo.colorClass}`}>
            {savingsRateInfo.text}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#ede9fe] text-[#8b5cf6] flex items-center justify-center text-lg">
          <i className="fa-solid fa-piggy-bank"></i>
        </div>
      </div>
    </section>
  );
};

export default StatsSummary;
