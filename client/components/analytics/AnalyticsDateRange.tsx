'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnalyticsDateRangeProps {
  onChange: (range: { start_date: string; end_date: string }) => void;
  defaultRange?: string;
}

export const AnalyticsDateRange = ({
  onChange,
  defaultRange = 'last_30_days',
}: AnalyticsDateRangeProps) => {
  const [selectedRange, setSelectedRange] = useState(defaultRange);

  const getDateRange = (range: string) => {
    const now = new Date();
    const end_date = now.toISOString().split('T')[0];
    let start_date = '';

    switch (range) {
      case 'today':
        start_date = end_date;
        break;
      case 'last_7_days':
        start_date = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
        break;
      case 'last_30_days':
        start_date = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
        break;
      case 'last_90_days':
        start_date = new Date(now.setDate(now.getDate() - 90)).toISOString().split('T')[0];
        break;
      case 'this_month':
        start_date = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        break;
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        start_date = lastMonth.toISOString().split('T')[0];
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start_date, end_date: endOfLastMonth.toISOString().split('T')[0] };
      case 'this_year':
        start_date = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      default:
        start_date = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
    }

    return { start_date, end_date };
  };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    const dateRange = getDateRange(range);
    onChange(dateRange);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="last_7_days">Last 7 days</SelectItem>
          <SelectItem value="last_30_days">Last 30 days</SelectItem>
          <SelectItem value="last_90_days">Last 90 days</SelectItem>
          <SelectItem value="this_month">This month</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
          <SelectItem value="this_year">This year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
