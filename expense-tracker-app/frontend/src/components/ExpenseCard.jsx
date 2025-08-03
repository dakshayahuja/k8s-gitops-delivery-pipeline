import { useState } from 'react';
import ExpenseDetails from './ExpenseDetails';

const ExpenseCard = ({ expense, currency = '₹' }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Get category icon based on title
  const getCategoryIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('grocery') || lowerTitle.includes('food')) return '🛒';
    if (lowerTitle.includes('internet') || lowerTitle.includes('wifi')) return '🌐';
    if (lowerTitle.includes('movie') || lowerTitle.includes('entertainment')) return '🎬';
    if (lowerTitle.includes('gym') || lowerTitle.includes('fitness')) return '💪';
    if (lowerTitle.includes('bill') || lowerTitle.includes('utility')) return '📄';
    if (lowerTitle.includes('transport') || lowerTitle.includes('uber')) return '🚗';
    if (lowerTitle.includes('misc') || lowerTitle.includes('other')) return '📦';
    return '💰';
  };

  // Format date - use date field if available, otherwise fallback to created_at
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const expenseDate = expense.date || expense.created_at;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-lg">{getCategoryIcon(expense.title)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{expense.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(expenseDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{currency}{expense.amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{expense.category}</span>
          </div>
          <button
            onClick={() => setShowDetails(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View Details →
          </button>
        </div>
      </div>

      {showDetails && (
        <ExpenseDetails
          expense={expense}
          onClose={() => setShowDetails(false)}
          currency={currency}
        />
      )}
    </>
  );
};

export default ExpenseCard;
