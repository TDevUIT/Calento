"use client";

import { useDroppable } from '@dnd-kit/core';
import { cn } from "@/lib/utils";

interface DroppableColumnProps {
  columnId: string;
  children: React.ReactNode;
}

export const DroppableColumn = ({ columnId, children }: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${columnId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-h-[400px] transition-all rounded-lg overflow-hidden",
        isOver 
          ? "bg-blue-50/50 border-2 border-dashed border-blue-500 " 
          : "border-2 border-transparent"
      )}
    >
      <div className="h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};
