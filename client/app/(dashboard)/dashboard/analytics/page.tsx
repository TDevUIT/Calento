'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import {
  AnalyticsStatsCard,
  TimeDistributionChart,
  CategoryAnalyticsChart,
  EventAnalyticsSummary,
  TimeUtilizationCard,
  AttendeeAnalyticsCard,
  BookingAnalyticsCard,
  AnalyticsDateRange,
} from '@/components/analytics';
import {
  useEventAnalytics,
  useTimeUtilization,
  useCategoryAnalytics,
  useTimeDistribution,
  useAttendeeAnalytics,
  useBookingAnalytics,
} from '@/hook/analytic';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { data: eventAnalytics, isLoading: eventLoading } = useEventAnalytics(dateRange);
  const { data: timeUtilization, isLoading: timeLoading } = useTimeUtilization(dateRange);
  const { data: categoryAnalytics, isLoading: categoryLoading } = useCategoryAnalytics({
    ...dateRange,
    limit: 6,
  });
  const { data: timeDistribution, isLoading: distributionLoading } = useTimeDistribution({
    ...dateRange,
    period: 'day',
    metric: 'events',
  });
  const { data: attendeeAnalytics, isLoading: attendeeLoading } = useAttendeeAnalytics(dateRange);
  const { data: bookingAnalytics, isLoading: bookingLoading } = useBookingAnalytics(dateRange);

  const handleDateRangeChange = (range: { start_date: string; end_date: string }) => {
    setDateRange(range);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your time patterns, meeting statistics, and productivity insights
            </p>
          </div>
          <AnalyticsDateRange onChange={handleDateRangeChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsStatsCard
            title="Total Events"
            value={eventAnalytics?.total_events || 0}
            icon={Calendar}
            loading={eventLoading}
            description="All events"
          />
          <AnalyticsStatsCard
            title="Upcoming Events"
            value={eventAnalytics?.upcoming_events || 0}
            icon={TrendingUp}
            loading={eventLoading}
            description="Scheduled ahead"
          />
          <AnalyticsStatsCard
            title="Utilization Rate"
            value={timeUtilization ? `${Math.round(timeUtilization.utilization_rate * 100)}%` : '0%'}
            icon={Clock}
            loading={timeLoading}
            description="Time scheduled"
          />
          <AnalyticsStatsCard
            title="Total Attendees"
            value={attendeeAnalytics?.total_attendees || 0}
            icon={Users}
            loading={attendeeLoading}
            description="Participants"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          <div className="lg:col-span-2 flex">
            <TimeDistributionChart
              data={timeDistribution || []}
              loading={distributionLoading}
            />
          </div>
          <div className="flex">
            <EventAnalyticsSummary
              data={eventAnalytics}
              loading={eventLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          <div className="flex">
            <CategoryAnalyticsChart
              data={categoryAnalytics || []}
              loading={categoryLoading}
            />
          </div>
          <div className="flex">
            <TimeUtilizationCard
              data={timeUtilization}
              loading={timeLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          <div className="flex">
            <AttendeeAnalyticsCard
              data={attendeeAnalytics}
              loading={attendeeLoading}
            />
          </div>
          <div className="flex">
            <BookingAnalyticsCard
              data={bookingAnalytics}
              loading={bookingLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
