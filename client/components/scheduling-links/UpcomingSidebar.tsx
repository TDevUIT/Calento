"use client";

import { Card, CardContent } from "@/components/ui/card";

interface UpcomingMeeting {
  name: string;
  date: string;
}

interface UpcomingSidebarProps {
  meeting: UpcomingMeeting;
}

export const UpcomingSidebar = ({ meeting }: UpcomingSidebarProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming</h3>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm">
              {meeting.name}
            </p>
            <p className="text-xs text-gray-600">
              {meeting.date}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
