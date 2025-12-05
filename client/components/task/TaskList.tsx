"use client";

import { useState } from "react";
import { Task } from "@/interface";
import { TaskItem } from "./TaskItem";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
}

export const TaskList = ({ tasks, isLoading }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No tasks found</p>
        <p className="text-gray-400 text-xs mt-1">
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={setEditingTask}
          />
        ))}
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
};
