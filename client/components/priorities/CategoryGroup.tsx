"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type PriorityItem } from "@/hook/usePriorityBoard";

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
    <div className="mb-4 shadow-none border-none rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-[#F7F8FC] transition-colors rounded-t-lg touch-auto"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-semibold text-gray-900 truncate">{category}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">{items.length}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-400 transition-transform",
          !isExpanded && "rotate-180"
        )} />
      </button>

      {isExpanded && (
        <div className="space-y-2 bg-white rounded-b-lg pb-2">
          {children}
        </div>
      )}
    </div>
  );
};
