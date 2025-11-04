"use client";

import { Clock, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Availability } from "@/interface/availability.interface";
import { DAY_NAMES } from "@/interface/availability.interface";

interface AvailabilityRuleCardProps {
  availability: Availability;
  onEdit: (availability: Availability) => void;
  onDelete: (id: string) => void;
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const AvailabilityRuleCard = ({
  availability,
  onEdit,
  onDelete,
}: AvailabilityRuleCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {DAY_NAMES[availability.day_of_week]}
              </h3>
              {!availability.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(availability.start_time)} -{" "}
                {formatTime(availability.end_time)}
              </span>
            </div>

            {availability.timezone && (
              <div className="text-xs text-gray-500">
                {availability.timezone}
              </div>
            )}
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(availability)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(availability.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
