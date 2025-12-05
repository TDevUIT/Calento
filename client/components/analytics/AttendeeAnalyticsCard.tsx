'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendeeAnalytics } from '@/interface';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AttendeeAnalyticsCardProps {
  data: AttendeeAnalytics | undefined;
  loading?: boolean;
}

export const AttendeeAnalyticsCard = ({
  data,
  loading = false,
}: AttendeeAnalyticsCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Attendees</CardTitle>
          <CardDescription>Most frequent participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.top_attendees.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-900 shadow-none w-full">
        <CardHeader>
          <CardTitle>Top Attendees</CardTitle>
          <CardDescription>Most frequent participants</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center py-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No attendee data available
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Attendee information will appear here once you have events with participants
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-none w-full flex flex-col">
      <CardHeader>
        <CardTitle>Top Attendees</CardTitle>
        <CardDescription>Most frequent participants</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pb-6 border-b">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.total_attendees}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.unique_attendees}</p>
            <p className="text-xs text-muted-foreground mt-1">Unique</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.average_per_event.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg/Event</p>
          </div>
        </div>

        {/* Top Attendees List */}
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Top Participants</h4>
          <div className="space-y-3">
            {data.top_attendees.slice(0, 5).map((attendee, index) => {
              const initials = attendee.name
                ? attendee.name.split(' ').map(n => n[0]).join('').toUpperCase()
                : attendee.email.substring(0, 2).toUpperCase();

              return (
                <div key={attendee.email} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-center min-w-[24px] w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                    {index + 1}
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs font-semibold bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {attendee.name || attendee.email}
                    </p>
                    {attendee.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {attendee.email}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-auto">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{attendee.event_count}</p>
                    <p className="text-xs text-muted-foreground">events</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
