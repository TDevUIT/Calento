"use client";

import { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Copy, Clock, ExternalLink, Circle, CheckSquare, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type PriorityItem } from "@/hook/usePriorityBoard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

interface DraggableItemProps {
  item: PriorityItem;
}

export const DraggableItem = ({ item }: DraggableItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
  
  const priorityBorderColors: Record<string, string> = {
    critical: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-blue-500",
    low: "border-l-gray-400",
  };
  
  const borderColor = isTask 
    ? priorityBorderColors[item.priority] || "border-l-gray-300"
    : "border-l-blue-500";

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Copy button clicked!"); // Debug log
    try {
      const linkUrl = `${window.location.origin}/book/${item.id}`;
      await navigator.clipboard.writeText(linkUrl);
      toast.success("Link copied!", {
        description: "Booking link has been copied to clipboard.",
      });
    } catch {
      toast.error("Failed to copy", {
        description: "Could not copy link to clipboard.",
      });
    }
  };

  const handleOpenLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const linkUrl = `${window.location.origin}/book/${item.id}`;
    window.open(linkUrl, '_blank');
    toast.success("Link opened", {
      description: "Booking link opened in new tab.",
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Edit", {
      description: `Editing "${item.title}"`,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.warning("Delete", {
      description: `Delete "${item.title}"? This action cannot be undone.`,
    });
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("Duplicated", {
      description: `Created a copy of "${item.title}"`,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group bg-white transition-all cursor-grab active:cursor-grabbing overflow-hidden border-l-4",
        borderColor,
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {isTask ? (
              <CheckSquare className="h-4 w-4 text-gray-300" />
            ) : (
              <Circle className="h-4 w-4 text-gray-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm truncate">{item.title}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {isTask 
                  ? item.metadata?.dueDate 
                    ? `Due ${format(new Date(item.metadata.dueDate), "MMM d")}`
                    : `Priority: ${item.priority}`
                  : "Next: Mon 10:00am"}
              </span>
            </div>
          </div>

          <div 
            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!isTask && (
              <>
                <button 
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="p-1 hover:bg-gray-100 rounded flex-shrink-0 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
                <button 
                  onClick={handleOpenLink}
                  title="Open in new tab"
                  className="p-1 hover:bg-gray-100 rounded flex-shrink-0 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0" title="Duration">
                  <Clock className="h-3 w-3" />
                  <span>1 hr</span>
                </div>
              </>
            )}
            
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-1 hover:bg-gray-100 rounded flex-shrink-0 transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {!isTask && (
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                {!isTask && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenLink}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
