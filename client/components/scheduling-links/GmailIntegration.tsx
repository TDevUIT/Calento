"use client";

import { Button } from "@/components/ui/button";

export const GmailIntegration = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-gray-500">
        Send a personalized Scheduling Links from Gmail
      </p>
      <div className="flex items-center justify-center gap-2 mt-2">
        <Button variant="ghost" size="sm" className="text-blue-600">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Add to Gmail
        </Button>
        <Button variant="link" size="sm" className="text-blue-600">
          Learn more
        </Button>
      </div>
    </div>
  );
};
