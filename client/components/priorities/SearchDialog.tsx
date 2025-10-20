"use client";

import { useState, useMemo } from "react";
import { Search, Video, CheckSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { PriorityItem } from "@/hook/usePriorityBoard";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PriorityItem[];
  onItemSelect?: (item: PriorityItem) => void;
}

const SearchDialog = ({ open, onOpenChange, items, onItemSelect }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return {};

    const query = searchQuery.toLowerCase();
    const results: Record<string, PriorityItem[]> = {};

    items.forEach((item) => {
      if (item.title.toLowerCase().includes(query)) {
        const category = item.category;
        if (!results[category]) {
          results[category] = [];
        }
        results[category].push(item);
      }
    });

    return results;
  }, [searchQuery, items]);

  const getCategoryLabel = (category: string) => {
    return category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Scheduling Links":
        return (
          <div className="p-2 bg-blue-100 rounded-md">
            <Video className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "Tasks":
        return (
          <div className="p-2 bg-green-100 rounded-md">
            <CheckSquare className="h-4 w-4 text-green-600" />
          </div>
        );
      case "Smart Meetings":
        return (
          <div className="p-2 bg-purple-100 rounded-md">
            <Video className="h-4 w-4 text-purple-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleItemClick = (item: PriorityItem) => {
    onItemSelect?.(item);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 top-[5%] translate-y-0 data-[state=open]:slide-in-from-top-4">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="sr-only">Search Priorities</DialogTitle>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for anything in Tempra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-lg h-16 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto px-2 pb-2">
          {Object.keys(filteredResults).length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              {searchQuery ? "No results found" : "Start typing to search..."}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(filteredResults).map(([category, categoryItems]) => (
                <div key={category} className="space-y-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">
                    {getCategoryLabel(category)} {categoryItems.length}
                  </div>
                  <div className="space-y-1">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleItemClick(item);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md transition-colors group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <div className="flex-shrink-0">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
