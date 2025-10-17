"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SchedulingLinkCardProps {
  title: string;
  description: string;
  duration: string;
  onClick: () => void;
}

export const SchedulingLinkCard = ({
  title,
  description,
  duration,
  onClick
}: SchedulingLinkCardProps) => {
  return (
    <Card 
      className="border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">1</span>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">T</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <span>Google Meet</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
