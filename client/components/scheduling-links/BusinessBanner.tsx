"use client";

import { X } from "lucide-react";

interface BusinessBannerProps {
  onClose: () => void;
}

export const BusinessBanner = ({ onClose }: BusinessBannerProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-900">
            Get more with <span className="font-semibold bg-orange-100 px-1 rounded">BUSINESS</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Reclaim now allows you to add Round Robin organizers to Scheduling Links.{' '}
            <a href="#" className="text-blue-600 hover:underline">Upgrade to get this feature</a>
          </p>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
