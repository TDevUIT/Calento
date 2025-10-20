"use client";

import { format } from "date-fns";
import { X, Calendar, Clock, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTaskDetail } from "@/hook/task";
import { cn } from "@/lib/utils";

interface TaskDetailDialogProps {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700 border-gray-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const TaskDetailDialog = ({
  taskId,
  open,
  onClose,
}: TaskDetailDialogProps) => {
  const { data, isLoading } = useTaskDetail(taskId || "");
  const task = data?.data;

  if (!task || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-gray-600">Loading task...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isCompleted = task.status === "completed";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle
                className={cn(
                  "text-2xl font-semibold pr-8",
                  isCompleted && "line-through text-gray-500"
                )}
              >
                {task.title}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", statusColors[task.status])}>
              {task.status.replace("_", " ")}
            </Badge>
          </div>

          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {task.due_date && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(task.due_date), "PPP")}
                  </p>
                </div>
              </div>
            )}

            {task.estimated_duration && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Estimated</p>
                  <p className="text-sm font-medium">
                    {task.estimated_duration} minutes
                  </p>
                </div>
              </div>
            )}

            {task.completed_at && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-sm font-medium">
                    {format(new Date(task.completed_at), "PPP")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Created {format(new Date(task.created_at), "PPP 'at' p")}
            </p>
            {task.updated_at !== task.created_at && (
              <p className="text-xs text-gray-500 mt-1">
                Updated {format(new Date(task.updated_at), "PPP 'at' p")}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
