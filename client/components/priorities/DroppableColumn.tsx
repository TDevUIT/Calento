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
        "flex-1 transition-colors",
        isOver && "bg-blue-50/50"
      )}
    >
      {children}
    </div>
  );
};
