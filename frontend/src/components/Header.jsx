import React from 'react';

const Header = ({ activeTab }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expenses';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-[#334155] leading-tight capitalize">
          {getTabTitle()}
        </h1>
        <p className="text-sm text-[#64748b]">Welcome back</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#334155] leading-tight">ap</p>
            <p className="text-[10px] text-[#64748b] leading-tight">ap@gmail.com</p>
          </div>
          <div className="w-10 h-10 bg-[#00bfae] text-white rounded-full flex items-center justify-center font-bold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
