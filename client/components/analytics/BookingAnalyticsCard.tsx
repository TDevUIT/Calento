'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookingAnalytics } from '@/interface/analytics.interface';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface BookingAnalyticsCardProps {
  data: BookingAnalytics | undefined;
  loading?: boolean;
}

export const BookingAnalyticsCard = ({
  data,
  loading = false,
}: BookingAnalyticsCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Statistics</CardTitle>
          <CardDescription>Overview of booking performance</CardDescription>
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
          <CardTitle>Booking Statistics</CardTitle>
          <CardDescription>Overview of booking performance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No booking data available</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Bookings',
      value: data.total_bookings,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Confirmed',
      value: data.confirmed_bookings,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Pending',
      value: data.pending_bookings,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      label: 'Cancelled',
      value: data.cancelled_bookings,
      icon: XCircle,
      color: 'text-red-600 bg-red-100',
    },
  ];

  const bookingRatePercent = (data.booking_rate * 100).toFixed(1);
  const cancellationRatePercent = (data.cancellation_rate * 100).toFixed(1);

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-none w-full flex flex-col">
      <CardHeader>
        <CardTitle>Booking Statistics</CardTitle>
        <CardDescription>Overview of booking performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Rates Section */}
        <div className="space-y-4 pt-6 border-t">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Booking Rate</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {bookingRatePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${bookingRatePercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cancellation Rate</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {cancellationRatePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-600 dark:bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${cancellationRatePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Booking Links */}
        {data.top_booking_links && data.top_booking_links.length > 0 && (
          <div className="pt-6 border-t">
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Top Booking Links</h4>
            <div className="space-y-3">
              {data.top_booking_links.slice(0, 3).map((link, index) => (
                <div key={link.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-center min-w-[24px] w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{link.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {link.booking_count} bookings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
