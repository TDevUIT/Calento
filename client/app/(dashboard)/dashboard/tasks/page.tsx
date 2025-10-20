"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/hook/task";
import { TaskPriority, TaskStatus } from "@/interface/task.interface";
import {
  CreateTaskDialog,
  TaskList,
  TaskFilters,
} from "@/components/task";

const TasksPage = () => {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);

  const { data, isLoading } = useTasks({
    page: 1,
    limit: 100,
    search: search || undefined,
  });

  const filteredTasks = useMemo(() => {
    if (!data?.data?.items) return [];
    
    const tasks = data.data.items;
    if (tasks.length === 0) return [];

    return tasks.filter((task) => {
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.status);
      const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);
      return statusMatch && priorityMatch;
    });
  }, [data?.data?.items, selectedStatuses, selectedPriorities]);

  const handleStatusToggle = (status: TaskStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track your tasks
            </p>
          </div>
          <CreateTaskDialog />
        </div>

        {/* <TaskStatistics /> */}

        <div className=" rounded-lg bg-white p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <TaskFilters
              selectedStatuses={selectedStatuses}
              selectedPriorities={selectedPriorities}
              onStatusChange={handleStatusToggle}
              onPriorityChange={handlePriorityToggle}
            />
          </div>

          <TaskList tasks={filteredTasks} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
