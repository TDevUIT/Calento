'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TimeUtilization } from '@/interface';
import { Clock } from 'lucide-react';

interface TimeUtilizationCardProps {
  data: TimeUtilization | undefined;
  loading?: boolean;
}

export const TimeUtilizationCard = ({
  data,
  loading = false,
}: TimeUtilizationCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time Utilization</CardTitle>
          <CardDescription>How you spend your time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="h-2 w-full bg-gray-200 animate-pulse rounded-full" />
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
          <CardTitle>Time Utilization</CardTitle>
          <CardDescription>How you spend your time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const utilizationPercentage = Math.min(100, Math.max(0, Math.round(data.utilization_rate * 100)));

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-none w-full flex flex-col">
      <CardHeader>
        <CardTitle>Time Utilization</CardTitle>
        <CardDescription>How you spend your time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Scheduled Hours</span>
              <span className="text-sm text-muted-foreground">
                {data.scheduled_hours.toFixed(1)}h / {data.total_hours.toFixed(1)}h
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${utilizationPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Free Hours</span>
              <span className="text-sm text-muted-foreground">
                {data.free_hours.toFixed(1)}h
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${100 - utilizationPercentage}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Utilization Rate</span>
              </div>
              <span className="text-2xl font-bold">{utilizationPercentage}%</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Busiest Day</span>
              <span className="font-medium">{data.busiest_day}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Busiest Hour</span>
              <span className="font-medium">{data.busiest_hour}:00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
