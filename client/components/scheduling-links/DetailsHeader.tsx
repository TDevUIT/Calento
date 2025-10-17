"use client";

import { ArrowLeft, Copy, ExternalLink, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailsHeaderProps {
  onBack: () => void;
}

export const DetailsHeader = ({ onBack }: DetailsHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Scheduling Link</span>
              <span>/</span>
              <span className="font-medium">Details</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Next:</span>
            <span className="text-sm font-medium text-blue-600">[CT]</span>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">1</span>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
