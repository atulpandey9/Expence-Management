import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsSummary from './components/StatsSummary';
import DashboardView from './components/DashboardView';
import IncomeView from './components/IncomeView';
import ExpenseView from './components/ExpenseView';

const API_BASE = 'http://localhost:3000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    todayExpenses: 0,
    todayIncome: 0,
    todaySavings: 0,
    recentTransactions: [],
    spendingByCategory: {},
    incomeByCategory: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch summary stats
      const statsRes = await fetch(`${API_BASE}/stats/summary`);
      if (!statsRes.ok) throw new Error('Failed to fetch dashboard stats.');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch incomes
      const incomesRes = await fetch(`${API_BASE}/incomes`);
      if (!incomesRes.ok) throw new Error('Failed to fetch income list.');
      const incomesData = await incomesRes.json();
      setIncomes(incomesData);

      // Fetch expenses
      const expensesRes = await fetch(`${API_BASE}/expenses`);
      if (!expensesRes.ok) throw new Error('Failed to fetch expenses list.');
      const expensesData = await expensesRes.json();
      setExpenses(expensesData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Server connection error. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAddIncome = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/incomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await refreshData();
        return true;
      } else {
        const err = await res.json();
        alert(`Failed to add income: ${err.message}`);
        return false;
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding income.');
      return false;
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/incomes/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await refreshData();
      } else {
        alert('Failed to delete income.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting income.');
    }
  };

  const handleAddExpense = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await refreshData();
        return true;
      } else {
        const err = await res.json();
        alert(`Failed to add expense: ${err.message}`);
        return false;
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding expense.');
      return false;
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await refreshData();
      } else {
        alert('Failed to delete expense.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting expense.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            stats={stats}
            incomes={incomes}
            expenses={expenses}
            refreshData={refreshData}
          />
        );
      case 'income':
        return (
          <IncomeView
            incomes={incomes}
            stats={stats}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            refreshData={refreshData}
          />
        );
      case 'expense':
        return (
          <ExpenseView
            expenses={expenses}
            stats={stats}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            refreshData={refreshData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-[#334155] flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="ml-16 md:ml-60 flex-grow p-4 md:p-8 min-h-screen transition-all duration-300">
        <Header activeTab={activeTab} />
        
        {loading && incomes.length === 0 && expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00bfae]"></div>
            <p className="text-sm text-[#64748b] mt-4 font-medium">Loading data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-left max-w-2xl mx-auto shadow-sm">
            <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i> Connection Error
            </h3>
            <p className="text-sm mb-4 leading-relaxed">{error}</p>
            <button
              onClick={refreshData}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4.5 py-2 rounded-lg cursor-pointer transition-all shadow-sm active:scale-[0.98]"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            <StatsSummary stats={stats} />
            {renderTabContent()}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
