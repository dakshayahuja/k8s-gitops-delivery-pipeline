import { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = ({ onClose, onSettingsUpdate }) => {
  const [settings, setSettings] = useState({
    currency: localStorage.getItem('currency') || '₹',
    theme: localStorage.getItem('theme') || 'dark',
    notifications: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/expenses/settings`);
      const savedCurrency = localStorage.getItem('currency') || '₹';
      const savedTheme = localStorage.getItem('theme') || 'dark';
      
      setSettings({
        ...response.data,
        currency: savedCurrency,
        theme: savedTheme,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/expenses/settings`, settings);
      // Apply theme immediately
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Update parent component
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleCurrencyChange = (currencySymbol) => {
    setSettings(prev => ({ ...prev, currency: currencySymbol }));
  };

  const currencies = [
    { symbol: '₹', name: 'Indian Rupee (INR)' },
    { symbol: '$', name: 'US Dollar (USD)' },
    { symbol: '€', name: 'Euro (EUR)' },
    { symbol: '£', name: 'British Pound (GBP)' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Appearance</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Light Theme</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Dark Theme</span>
              </label>
            </div>
          </div>

          {/* Currency Settings */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Currency</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {currencies.map(({ symbol, name }) => (
                <button
                  key={symbol}
                  onClick={() => handleCurrencyChange(symbol)}
                  className={`p-4 rounded-lg border ${
                    settings.currency === symbol
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{symbol}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;