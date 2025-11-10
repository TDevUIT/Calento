'use client';

import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full mx-auto p-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border-2 border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Processing Authentication
          </h1>
          
          <p className="text-base font-medium text-blue-600 dark:text-blue-400 mb-6">
            Please wait...
          </p>
          
          <div className="space-y-2">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-2/3 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Verifying your credentials...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
