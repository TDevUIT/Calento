"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, CheckSquare, Video, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SearchItem {
  id: string;
  title: string;
  category: "Events" | "Tasks" | "Scheduling Links";
  type: string;
  metadata?: {
    date?: string;
    time?: string;
    duration?: number;
    status?: string;
  };
}

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events?: unknown[];
  tasks?: unknown[];
  bookingLinks?: unknown[];
}

const GlobalSearchDialog = ({ 
  open, 
  onOpenChange,
  events = [],
  tasks = [],
  bookingLinks = []
}: GlobalSearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
        setSearchQuery("");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const allItems = useMemo(() => {
    const items: SearchItem[] = [];

    events.forEach((event) => {
      const e = event as { id: string; title?: string; start_time?: string };
      items.push({
        id: e.id,
        title: e.title || "Untitled Event",
        category: "Events",
        type: "event",
        metadata: {
          date: e.start_time ? new Date(e.start_time).toLocaleDateString() : undefined,
          time: e.start_time ? new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        }
      });
    });

    tasks.forEach((task) => {
      const t = task as { id: string; title?: string; status?: string; due_date?: string };
      items.push({
        id: t.id,
        title: t.title || "Untitled Task",
        category: "Tasks",
        type: "task",
        metadata: {
          status: t.status,
          date: t.due_date ? new Date(t.due_date).toLocaleDateString() : undefined,
        }
      });
    });

    bookingLinks.forEach((link) => {
      const l = link as { id: string; title?: string; duration_minutes?: number };
      items.push({
        id: l.id,
        title: l.title || "Untitled Link",
        category: "Scheduling Links",
        type: "booking_link",
        metadata: {
          duration: l.duration_minutes,
        }
      });
    });

    return items;
  }, [events, tasks, bookingLinks]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return {};

    const query = searchQuery.toLowerCase();
    const results: Record<string, SearchItem[]> = {};

    allItems.forEach((item) => {
      if (item.title.toLowerCase().includes(query)) {
        const category = item.category;
        if (!results[category]) {
          results[category] = [];
        }
        results[category].push(item);
      }
    });

    return results;
  }, [searchQuery, allItems]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Events":
        return (
          <div className="p-2 bg-blue-100 rounded-md">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "Tasks":
        return (
          <div className="p-2 bg-green-100 rounded-md">
            <CheckSquare className="h-4 w-4 text-green-600" />
          </div>
        );
      case "Scheduling Links":
        return (
          <div className="p-2 bg-purple-100 rounded-md">
            <Video className="h-4 w-4 text-purple-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleItemClick = (item: SearchItem) => {
    onOpenChange(false);
    setSearchQuery("");
    
    switch (item.category) {
      case "Events":
        router.push(`/dashboard/calendar`);
        break;
      case "Tasks":
        router.push(`/dashboard/tasks`);
        break;
      case "Scheduling Links":
        router.push(`/dashboard/scheduling-links`);
        break;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl pt-0 gap-0 top-[5%] translate-y-0 data-[state=open]:slide-in-from-top-4">
        <DialogHeader>
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for events, tasks, meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-lg h-16 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto px-2 pb-2">
          {Object.keys(filteredResults).length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              {searchQuery ? "No results found" : "Start typing to search across events, tasks, and meetings..."}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {Object.entries(filteredResults).map(([category, categoryItems]) => (
                <div key={category} className="space-y-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50 rounded-md">
                    {category} <span className="text-gray-400">({categoryItems.length})</span>
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
                          {item.metadata && (
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                              {item.metadata.date && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {item.metadata.date}
                                </span>
                              )}
                              {item.metadata.time && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md">
                                  <Clock className="h-3.5 w-3.5" />
                                  {item.metadata.time}
                                </span>
                              )}
                              {item.metadata.duration && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-md">
                                  <Clock className="h-3.5 w-3.5" />
                                  {item.metadata.duration} min
                                </span>
                              )}
                              {item.metadata.status && (
                                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                                  {item.metadata.status}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {Object.keys(filteredResults).length > 0 && (
          <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded">ESC</kbd> to close</span>
              <span className="font-medium">{Object.values(filteredResults).flat().length} results found</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchDialog;
