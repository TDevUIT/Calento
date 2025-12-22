'use client';

import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  return (
    <div className="rounded-2xl border border-cod-gray-200 bg-white p-8 text-center shadow-sm dark:border-cod-gray-800 dark:bg-cod-gray-900">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cod-gray-50 dark:bg-cod-gray-950">
        <Loader2 className="h-6 w-6 animate-spin text-cod-gray-700 dark:text-cod-gray-200" aria-hidden="true" />
      </div>

      <h1 className="text-xl font-semibold text-cod-gray-900 dark:text-white tracking-tight">
        Processing authentication
      </h1>
      <p className="mt-2 text-sm text-cod-gray-600 dark:text-cod-gray-400">
        Please wait while we securely complete the sign-in process.
      </p>

      <div className="mt-6 flex items-center justify-center">
        <div className="h-1.5 w-40 rounded-full bg-cod-gray-200 dark:bg-cod-gray-800 overflow-hidden" aria-hidden="true">
          <div className="h-full w-1/2 rounded-full bg-cod-gray-500/60 dark:bg-cod-gray-300/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
