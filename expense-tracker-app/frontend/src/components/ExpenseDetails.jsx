import { useEffect, useRef } from 'react';

const ExpenseDetails = ({ expense, onClose, currency = '₹' }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">
                {expense.title.toLowerCase().includes('grocery') ? '🛒' :
                 expense.title.toLowerCase().includes('internet') ? '🌐' :
                 expense.title.toLowerCase().includes('movie') ? '🎬' :
                 expense.title.toLowerCase().includes('gym') ? '💪' :
                 expense.title.toLowerCase().includes('bill') ? '📄' :
                 expense.title.toLowerCase().includes('transport') ? '🚗' : '💰'}
              </span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{expense.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {currency}{expense.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Date</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(expense.date).toLocaleDateString('en-US', {
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
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;