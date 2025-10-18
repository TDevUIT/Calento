"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SchedulingLinksHeaderProps {
  onCreateClick: () => void;
}

export const SchedulingLinksHeader = ({
  onCreateClick,
}: SchedulingLinksHeaderProps) => {
  return (
    <div className="bg-white">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Scheduling Links</h1>
          <Button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            New link
          </Button>
        </div>
      </div>
    </div>
  );
};
