import React from 'react';
import { useAuth } from '../auth/context/AuthContext';

const Header = ({ activeTab }) => {
  const { user } = useAuth();

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

  const username = user?.username || 'User';
  const email = user?.email || '';
  const initial = (username[0] || 'U').toUpperCase();

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-[#334155] leading-tight capitalize">
          {getTabTitle()}
        </h1>
        <p className="text-sm text-[#64748b]">
          Welcome back{user?.username ? `, ${user.username}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#334155] leading-tight capitalize">
              {username}
            </p>
            <p className="text-[10px] text-[#64748b] leading-tight">{email}</p>
          </div>
          <div className="w-10 h-10 bg-[#00bfae] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
