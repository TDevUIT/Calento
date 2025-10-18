"use client";

import { Card, CardContent } from "@/components/ui/card";

interface UpcomingMeeting {
  name: string;
  date: string;
  email?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  phone?: string;
  notes?: string;
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
            <p className="font-medium text-gray-900 text-sm truncate">
              {meeting.name}
            </p>
            {meeting.email && (
              <p className="text-xs text-gray-600 truncate">
                {meeting.email}
              </p>
            )}
            <p className="text-xs text-gray-600">
              {meeting.date}
            </p>
            {meeting.phone && (
              <p className="text-xs text-gray-600 truncate">
                {meeting.phone}
              </p>
            )}
            {meeting.notes && (
              <p className="text-xs text-gray-600 truncate">
                {meeting.notes}
              </p>
            )}
          </div>
          {meeting.status && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              meeting.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              meeting.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {meeting.status}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
