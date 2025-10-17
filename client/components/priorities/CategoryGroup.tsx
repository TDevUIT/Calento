"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PriorityItem {
  id: string;
  title: string;
  category: string;
  priority: string;
}

interface CategoryGroupProps {
  category: string;
  items: PriorityItem[];
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CategoryGroup = ({ category, items, isExpanded, onToggle, children }: CategoryGroupProps) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{category}</span>
          <span className="text-xs text-gray-400">{items.length}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-400 transition-transform",
          !isExpanded && "rotate-180"
        )} />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};
