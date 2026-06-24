import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-16 md:w-60 bg-white border-r border-[#e2e8f0] flex flex-col p-4 md:p-6 fixed h-screen left-0 top-0 transition-all duration-300 z-10">
      {/* Logo Section */}
      <div className="flex items-center gap-2.5 mb-8 justify-center md:justify-start">
        <i className="fa-solid fa-chart-line text-[#00bfae] text-2xl"></i>
        <h2 className="hidden md:block font-['Outfit'] font-bold text-xl text-[#334155]">
          Expense Tracker
        </h2>
      </div>

      {/* User Mini Profile */}
      <div className="flex items-center gap-2.5 p-2 bg-[#f3f6f9] rounded-xl mb-8 justify-center md:justify-start overflow-hidden">
        <div className="w-8 h-8 min-w-[32px] bg-[#00bfae] text-white rounded-full flex items-center justify-center font-bold text-sm">
          A
        </div>
        <div className="hidden md:block text-left truncate">
          <p className="text-xs font-semibold text-[#334155] leading-tight">ap</p>
          <p className="text-[10px] text-[#64748b] truncate leading-tight">ap@gmail.com</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-grow list-none flex flex-col gap-2">
        <li>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-[#e6f9f7] text-[#00bfae]'
                : 'text-[#64748b] hover:bg-[#e6f9f7] hover:text-[#00bfae]'
            }`}
          >
            <i className="fa-solid fa-house text-lg w-5 text-center"></i>
            <span className="hidden md:inline">Dashboard</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('income')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'income'
                ? 'bg-[#e6f9f7] text-[#00bfae]'
                : 'text-[#64748b] hover:bg-[#e6f9f7] hover:text-[#00bfae]'
            }`}
          >
            <i className="fa-solid fa-arrow-trend-up text-lg w-5 text-center"></i>
            <span className="hidden md:inline">Income</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('expense')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'expense'
                ? 'bg-[#e6f9f7] text-[#00bfae]'
                : 'text-[#64748b] hover:bg-[#e6f9f7] hover:text-[#00bfae]'
            }`}
          >
            <i className="fa-solid fa-arrow-trend-down text-lg w-5 text-center"></i>
            <span className="hidden md:inline">Expenses</span>
          </button>
        </li>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#e2e8f0] pt-4 mt-auto hidden md:block">
        <p className="text-[10px] text-[#64748b] text-center">
          Expensely © 2026
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
