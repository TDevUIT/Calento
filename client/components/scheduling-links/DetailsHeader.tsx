"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailsHeaderProps {
  onBack: () => void;
}

export const DetailsHeader = ({ onBack }: DetailsHeaderProps) => {
  return (
    <div className="bg-white">
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
        </div>
      </div>
    </div>
  );
};
