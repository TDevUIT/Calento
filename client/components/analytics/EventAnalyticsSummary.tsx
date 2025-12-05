'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EventAnalytics } from '@/interface';
import { Calendar, TrendingUp, Clock, Repeat } from 'lucide-react';

interface EventAnalyticsSummaryProps {
  data: EventAnalytics | undefined;
  loading?: boolean;
}

export const EventAnalyticsSummary = ({
  data,
  loading = false,
}: EventAnalyticsSummaryProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Summary</CardTitle>
          <CardDescription>Overview of your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Summary</CardTitle>
          <CardDescription>Overview of your events</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Events',
      value: data.total_events,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Upcoming Events',
      value: data.upcoming_events,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'This Week',
      value: data.events_this_week,
      icon: Clock,
      color: 'text-orange-600 bg-orange-100',
    },
    {
      label: 'Recurring Events',
      value: data.recurring_events,
      icon: Repeat,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-none w-full flex flex-col">
      <CardHeader>
        <CardTitle>Event Summary</CardTitle>
        <CardDescription>Overview of your events</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
