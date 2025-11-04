"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklySchedule } from "@/interface/availability.interface";
import { DAY_NAMES_SHORT } from "@/interface/availability.interface";

interface WeeklyScheduleViewProps {
  schedule: WeeklySchedule;
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes}${ampm}`;
};

export const WeeklyScheduleView = ({ schedule }: WeeklyScheduleViewProps) => {
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Schedule Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => {
            const availabilities = schedule[day] || [];
            const hasAvailability = availabilities.length > 0;

            return (
              <div
                key={day}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  hasAvailability
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="text-center mb-2">
                  <div className="font-semibold text-sm text-gray-900">
                    {DAY_NAMES_SHORT[day as keyof typeof DAY_NAMES_SHORT]}
                  </div>
                </div>

                <div className="space-y-1">
                  {hasAvailability ? (
                    availabilities.map((availability) => (
                      <div
                        key={availability.id}
                        className={`text-xs rounded px-2 py-1 ${
                          availability.is_active
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">
                            {formatTime(availability.start_time)}-
                            {formatTime(availability.end_time)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-2">
                      No availability
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border-2 border-blue-200" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-100 border-2 border-gray-200" />
            <span>Not available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
