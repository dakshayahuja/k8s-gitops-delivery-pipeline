import { useState } from 'react';
import ExpenseDetails from './ExpenseDetails';
import EditExpenseModal from './EditExpenseModal';
import { getCategoryEmoji, getCategoryColor } from '../utils/categoryMapping';

const ExpenseCard = ({ expense, currency = '₹', onUpdate, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${expense.title}" (${currency}${expense.amount})? This action cannot be undone.`)) {
      onDelete(expense.id);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow flex flex-col">
        {/* Clickable tile above horizontal line */}
        <div 
          className="flex items-start justify-between mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors flex-1"
          onClick={toggleDetails}
        >
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className={`w-10 h-10 ${getCategoryColor(expense.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className="text-lg">{getCategoryEmoji(expense.category)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">{expense.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(expenseDate)}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{currency}{expense.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Inline details section */}
        {showDetails && (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Category</span>
              <span className="text-gray-900 dark:text-white font-medium">{expense.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Date</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(expenseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Created</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(expense.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}

        {/* Bottom section with consistent spacing */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{expense.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditExpenseModal
          expense={expense}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
          currency={currency}
        />
      )}
    </>
  );
};

export default ExpenseCard;
