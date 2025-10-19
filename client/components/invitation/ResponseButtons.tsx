import { Check, X, AlertCircle, Loader2 } from 'lucide-react';

interface ResponseButtonsProps {
  onResponse: (action: 'accept' | 'decline' | 'tentative') => void;
  isPending: boolean;
}

export const ResponseButtons = ({ onResponse, isPending }: ResponseButtonsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <button
        onClick={() => onResponse('accept')}
        disabled={isPending}
        className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center gap-2">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Yes</span>
        </div>
        {isPending && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          </div>
        )}
      </button>

      <button
        onClick={() => onResponse('tentative')}
        disabled={isPending}
        className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Maybe</span>
        </div>
        {isPending && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
          </div>
        )}
      </button>

      <button
        onClick={() => onResponse('decline')}
        disabled={isPending}
        className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center gap-2">
          <X className="h-6 w-6 text-red-600 dark:text-red-400" />
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">No</span>
        </div>
        {isPending && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          </div>
        )}
      </button>
    </div>
  );
};
