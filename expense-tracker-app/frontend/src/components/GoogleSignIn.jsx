import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const GOOGLE_SRC = "https://accounts.google.com/gsi/client";

export default function GoogleSignIn() {
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState(null);

  const handleCredentialResponse = async (response) => {
    try {
      const idToken = response?.credential;
      if (!idToken) throw new Error("No credential returned from Google");
      const ok = await login(idToken);
      if (!ok) throw new Error("Login failed");
    } catch (e) {
      setError(e.message || "Sign-in failed");
    }
  };

  useEffect(() => {
    const init = () => {
      if (initializedRef.current) return;
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {});
      }
      initializedRef.current = true;
    };

    const existing = document.querySelector(`script[src="${GOOGLE_SRC}"]`);
    if (window.google?.accounts?.id) {
      init();
      return;
    }

    if (existing) {
      existing.addEventListener("load", init, { once: true });
      return () => existing.removeEventListener("load", init);
    }

    const s = document.createElement("script");
    s.src = GOOGLE_SRC;
    s.async = true;
    s.defer = true;
    s.onload = init;
    s.onerror = () => setError("Failed to load Google Sign-In");
    document.head.appendChild(s);

    return () => {
      s.onload = null;
      s.onerror = null;
    };
  }, []);

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
        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your data will be securely stored and only accessible to you
          </p>
        </div>
      </div>
    </div>
  );
}
