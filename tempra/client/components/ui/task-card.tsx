'use client';

import React from 'react';

interface Task {
  id: string;
  name: string;
  time: string;
  avatars?: string[];
}

interface TaskCardProps {
  tasks: Task[];
}

export const TaskCard: React.FC<TaskCardProps> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Front end
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            Design
          </span>
        </div>
        <span className="text-sm text-gray-500 font-medium">3 tasks</span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
              <span className="text-sm text-gray-700 font-medium">{task.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{task.time}</span>
              {task.avatars && (
                <div className="flex -space-x-2">
                  {task.avatars.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
