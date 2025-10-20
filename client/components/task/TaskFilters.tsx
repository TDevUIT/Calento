"use client";

import { useRef } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriority, TaskStatus } from "@/interface/task.interface";

interface TaskFiltersProps {
  selectedStatuses: TaskStatus[];
  selectedPriorities: TaskPriority[];
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
}

export const TaskFilters = ({
  selectedStatuses,
  selectedPriorities,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.includes(TaskStatus.TODO)}
          onCheckedChange={() => onStatusChange(TaskStatus.TODO)}
        >
          To Do
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.includes(TaskStatus.IN_PROGRESS)}
          onCheckedChange={() => onStatusChange(TaskStatus.IN_PROGRESS)}
        >
          In Progress
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.includes(TaskStatus.COMPLETED)}
          onCheckedChange={() => onStatusChange(TaskStatus.COMPLETED)}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.includes(TaskStatus.CANCELLED)}
          onCheckedChange={() => onStatusChange(TaskStatus.CANCELLED)}
        >
          Cancelled
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Priority</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={selectedPriorities.includes(TaskPriority.LOW)}
          onCheckedChange={() => onPriorityChange(TaskPriority.LOW)}
        >
          Low
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedPriorities.includes(TaskPriority.MEDIUM)}
          onCheckedChange={() => onPriorityChange(TaskPriority.MEDIUM)}
        >
          Medium
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedPriorities.includes(TaskPriority.HIGH)}
          onCheckedChange={() => onPriorityChange(TaskPriority.HIGH)}
        >
          High
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedPriorities.includes(TaskPriority.CRITICAL)}
          onCheckedChange={() => onPriorityChange(TaskPriority.CRITICAL)}
        >
          Critical
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};
