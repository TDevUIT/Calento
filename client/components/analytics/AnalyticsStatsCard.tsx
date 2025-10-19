'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface AnalyticsStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
  icon: LucideIcon;
  loading?: boolean;
}

export const AnalyticsStatsCard = ({
  title,
  value,
  change,
  description,
  icon: Icon,
  loading = false,
}: AnalyticsStatsCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-none rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
            <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{value}</div>
          </div>
        </div>
      </CardHeader>
      {(change !== undefined || description) && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="flex items-center gap-2 ml-9">
            {change !== undefined && (
              <span
                className={`flex items-center text-xs font-medium ${
                  isPositive
                    ? 'text-green-600'
                    : isNegative
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {isPositive && <ArrowUp className="h-3 w-3 mr-0.5" />}
                {isNegative && <ArrowDown className="h-3 w-3 mr-0.5" />}
                {change > 0 ? '+' : ''}
                {change}%
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        </CardContent>
      )}
    </div>
  );
};
