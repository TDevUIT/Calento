"use client";

import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "@/interface/task.interface";
import { useUpdateTaskStatus, useDeleteTask, useRestoreTask } from "@/hook/task";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const priorityColors = {
  [TaskPriority.LOW]: "bg-gray-100 text-gray-700 border-gray-200",
  [TaskPriority.MEDIUM]: "bg-blue-100 text-blue-700 border-blue-200",
  [TaskPriority.HIGH]: "bg-orange-100 text-orange-700 border-orange-200",
  [TaskPriority.CRITICAL]: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  [TaskStatus.TODO]: "bg-gray-100 text-gray-700",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700",
  [TaskStatus.COMPLETED]: "bg-green-100 text-green-700",
  [TaskStatus.CANCELLED]: "bg-red-100 text-red-700",
};

export const TaskItem = ({ task, onEdit }: TaskItemProps) => {
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: restoreTask } = useRestoreTask();

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isDeleted = task.is_deleted;
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

  const handleToggleStatus = () => {
    const newStatus = isCompleted ? TaskStatus.TODO : TaskStatus.COMPLETED;
    updateStatus({ id: task.id, status: newStatus });
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleRestore = () => {
    restoreTask(task.id);
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-lg p-4 transition-all",
        isDeleted && "opacity-50",
        isOverdue && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleStatus}
          className="mt-1 flex-shrink-0 transition-colors"
          disabled={isDeleted}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {task.due_date && (
                <div className={cn(
                  "flex items-center gap-1",
                  isOverdue ? "text-red-600" : "text-gray-600"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.due_date), "MMM d, yyyy")}</span>
                </div>
              )}

              {task.estimated_duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimated_duration}m</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!isDeleted && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onEdit?.(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              {isDeleted && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleRestore}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <h3
            className={cn(
              "font-medium text-gray-900",
              isCompleted && "line-through text-gray-500"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
              {task.priority}
            </Badge>

            <Badge variant="outline" className={cn("text-xs", statusColors[task.status])}>
              {task.status.replace("_", " ")}
            </Badge>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
