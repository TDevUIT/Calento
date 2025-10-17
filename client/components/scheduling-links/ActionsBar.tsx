"use client";

import { Search, List, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ActionsBar = () => {
  return (
    <div className="flex items-center justify-end gap-2 mb-6">
      <Button variant="ghost" size="sm">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-blue-600">
        <List className="h-4 w-4 mr-1" />
        List
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-600">
        <HelpCircle className="h-4 w-4 mr-1" />
        Help
      </Button>
      <Button variant="ghost" size="sm">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
