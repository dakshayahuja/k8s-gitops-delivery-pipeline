import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const GoogleSignIn = () => {
  const { login } = useAuth();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const success = await login(response.credential);
      if (!success) {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to manage your expenses
          </p>
        </div>
        
        <div className="flex justify-center">
          <div ref={googleButtonRef}></div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your data will be securely stored and only accessible to you
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignIn;