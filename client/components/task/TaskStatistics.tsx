"use client";

import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { useTaskStatistics } from "@/hook/task";
import { Card } from "@/components/ui/card";

export const TaskStatistics = () => {
  const { data, isLoading } = useTaskStatistics();

  if (isLoading || !data) return null;

  const stats = data.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold mt-1">{stats.by_status.completed}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold mt-1">{stats.by_status.in_progress}</p>
          </div>
          <Clock className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold mt-1">{stats.overdue}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
      </div>
    </div>
  );
};
