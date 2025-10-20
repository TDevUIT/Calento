"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ViewSelector() {
  return (
    <Select defaultValue="calendar">
      <SelectTrigger className="w-[240px] h-9 border-0 bg-transparent hover:bg-accent font-medium">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Next:</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="calendar">My Calendar - Week View</SelectItem>
        <SelectItem value="today">Today&apos;s Schedule</SelectItem>
        <SelectItem value="upcoming">Upcoming Events</SelectItem>
        <SelectItem value="team">Team Calendar</SelectItem>
      </SelectContent>
    </Select>
  );
}
