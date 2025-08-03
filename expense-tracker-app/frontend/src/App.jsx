import { useEffect, useState } from "react";
import axios from "axios";
import ExpenseList from "./components/ExpenseList";
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import GoogleSignIn from "./components/GoogleSignIn";
import { useAuth } from "./contexts/AuthContext";
import { getAvailableCategories } from "./utils/categoryMapping";

const App = () => {
  const { user, loading, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedCount, setSeedCount] = useState(10);
  const [customSeedCount, setCustomSeedCount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState(() => ({
    currency: localStorage.getItem("currency") || "₹",
    theme: localStorage.getItem("theme") || "dark",
  }));

  // Add expense form state
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadSettings();
    }
  }, [user]);

  useEffect(() => {
    // Apply theme on initial load
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const loadExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/expenses/`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-settings`);
      const backendSettings = response.data;
      
      // Use backend settings as primary source, fallback to localStorage
      setSettings({
        currency: backendSettings.currency || localStorage.getItem("currency") || "₹",
        theme: backendSettings.theme || localStorage.getItem("theme") || "dark"
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      // Fallback to localStorage if backend fails
      setSettings({
        currency: localStorage.getItem("currency") || "₹",
        theme: localStorage.getItem("theme") || "dark"
      });
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) {
      alert("Please fill in title and amount");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/expenses/`, {
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date
      });

      setExpenses([response.data, ...expenses]);
      setNewExpense({
        title: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert('Error adding expense');
    }
  };

  const handleSeedData = async () => {
    try {
      const count = showCustomInput ? parseInt(customSeedCount) : seedCount;
      if (showCustomInput && (!customSeedCount || count <= 0 || count > 1000)) {
        alert("Please enter a valid number between 1 and 1000");
        return;
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/expenses/seed?count=${count}`);
      setExpenses(response.data);
      setShowSeedModal(false);
      setCustomSeedCount("");
      setShowCustomInput(false);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all expenses? This action cannot be undone.')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/clear`);
        setExpenses([]);
      } catch (error) {
        console.error("Error clearing data:", error);
      }
    }
  };

  const handleSettingsUpdate = async (newSettings) => {
    try {
      // Save to backend first
      await axios.put(`${import.meta.env.VITE_API_URL}/user-settings`, {
        currency: newSettings.currency,
        theme: newSettings.theme
      });
      
      // Update local state
      setSettings(newSettings);
      
      // Also save to localStorage as backup
      localStorage.setItem("currency", newSettings.currency);
      localStorage.setItem("theme", newSettings.theme);
    } catch (error) {
      console.error("Error saving settings:", error);
      // If backend fails, still update localStorage
      localStorage.setItem("currency", newSettings.currency);
      localStorage.setItem("theme", newSettings.theme);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in page if not authenticated
  if (!user) {
    return <GoogleSignIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                {/* User Profile Section */}
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {user.picture && (
                      <img 
                        src={user.picture} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-600"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setShowSeedModal(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          🌱 Seed Data
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setShowReports(true)}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
              >
                📈 Reports
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
              >
                ⚙️ Settings
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{settings.currency}{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{expenses.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xl">📅</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {settings.currency}{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(0) : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">📊</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Expenses</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your spending and manage your budget
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm font-medium transition-colors flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add Expense</span>
            </button>
          </div>

          {/* Expense List */}
          {loadingExpenses ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading expenses...
                </p>
              </div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 dark:text-gray-500 text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No expenses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start tracking your expenses by adding your first one.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ExpenseList expenses={expenses} currency={settings.currency} />
            </div>
          )}
        </main>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Expense
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Groceries"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {getAvailableCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSettingsUpdate={handleSettingsUpdate}
        />
      )}

      {/* Reports Modal */}
      {showReports && (
        <Reports
          onClose={() => setShowReports(false)}
          currency={settings.currency}
        />
      )}

      {/* Seed Data Modal */}
      {showSeedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Seed Data
              </h3>
              <button
                onClick={() => setShowSeedModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Expenses to Seed
                </label>
                <select
                  value={showCustomInput ? "custom" : seedCount}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setShowCustomInput(true);
                    } else {
                      setShowCustomInput(false);
                      setSeedCount(parseInt(e.target.value));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={5}>5 items</option>
                  <option value={10}>10 items</option>
                  <option value={20}>20 items</option>
                  <option value={50}>50 items</option>
                  <option value={100}>100 items</option>
                  <option value="custom">Custom number</option>
                </select>
              </div>
              
              {showCustomInput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Number (1-1000)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={customSeedCount}
                    onChange={(e) => setCustomSeedCount(e.target.value)}
                    placeholder="Enter number of items"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={handleClearData}
                  className="w-full text-left px-3 py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors rounded-lg"
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSeedModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSeedData}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Seed Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
