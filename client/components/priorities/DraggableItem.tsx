"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Copy, Clock, ExternalLink, Circle, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityItem } from "./CategoryGroup";

interface DraggableItemProps {
  item: PriorityItem;
}

export const DraggableItem = ({ item }: DraggableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isTask = item.category === "Tasks";
  const borderColor = item.category === "Scheduling Links" ? "border-l-blue-500" : "border-l-gray-300";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group bg-white border border-gray-200 border-l-4 rounded hover:shadow-md transition-all cursor-default",
        borderColor,
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isTask ? (
              <CheckSquare className="h-4 w-4 text-gray-300" />
            ) : (
              <Circle className="h-4 w-4 text-gray-300" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm">{item.title}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <CheckSquare className="h-3 w-3" />
              <span>
                {item.category === "Scheduling Links" 
                  ? "Next: Mon 10:00am" 
                  : "Due 10/20"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Copy className="h-3.5 w-3.5 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </button>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>1 hr</span>
            </div>
            <button 
              {...listeners}
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing touch-none"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
