"use client";

import { Calendar, Clock, TrendingUp, Users, Video, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    label: "Total Events",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    description: "vs last month"
  },
  {
    label: "Meeting Hours",
    value: "42.5",
    change: "+8%",
    trend: "up",
    icon: Clock,
    description: "hours this month"
  },
  {
    label: "Meetings Attended",
    value: "89",
    change: "+15%",
    trend: "up",
    icon: Users,
    description: "vs last month"
  },
  {
    label: "Video Calls",
    value: "34",
    change: "-5%",
    trend: "down",
    icon: Video,
    description: "vs last month"
  }
];

const timeDistribution = [
  { label: "Meetings", hours: 42, percentage: 35, color: "bg-blue-500" },
  { label: "Focus Time", hours: 56, percentage: 47, color: "bg-green-500" },
  { label: "Breaks", hours: 12, percentage: 10, color: "bg-yellow-500" },
  { label: "Other", hours: 10, percentage: 8, color: "bg-gray-500" }
];

const weeklyActivity = [
  { day: "Mon", events: 12, hours: 6 },
  { day: "Tue", events: 15, hours: 7.5 },
  { day: "Wed", events: 10, hours: 5 },
  { day: "Thu", events: 18, hours: 9 },
  { day: "Fri", events: 14, hours: 7 },
  { day: "Sat", events: 3, hours: 1.5 },
  { day: "Sun", events: 2, hours: 1 }
];

const topMeetingTypes = [
  { type: "Team Sync", count: 24, percentage: 27 },
  { type: "1-on-1", count: 18, percentage: 20 },
  { type: "Client Call", count: 15, percentage: 17 },
  { type: "Planning", count: 12, percentage: 13 },
  { type: "Other", count: 20, percentage: 23 }
];

const productivityInsights = [
  {
    title: "Peak Productivity Hours",
    value: "9 AM - 11 AM",
    description: "You're most productive during morning hours",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    title: "Busiest Day",
    value: "Thursday",
    description: "Average 9 hours of meetings on Thursdays",
    icon: Calendar,
    color: "text-blue-600"
  },
  {
    title: "Meeting Efficiency",
    value: "85%",
    description: "Meetings start on time",
    icon: Clock,
    color: "text-purple-600"
  }
];

export default function AnalyticsPage() {
  const maxEvents = Math.max(...weeklyActivity.map(d => d.events));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your time patterns, meeting statistics, and productivity insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`flex items-center text-xs font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Events and hours per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyActivity.map((day) => (
                <div key={day.day}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{day.day}</span>
                    <div className="text-sm text-muted-foreground">
                      {day.events} events • {day.hours}h
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-persian-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(day.events / maxEvents) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>How you spend your time this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeDistribution.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <div className="text-sm text-muted-foreground">
                      {item.hours}h • {item.percentage}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Meeting Types */}
        <Card>
          <CardHeader>
            <CardTitle>Top Meeting Types</CardTitle>
            <CardDescription>Most common meeting categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMeetingTypes.map((meeting, index) => (
                <div key={meeting.type} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-persian-blue-100 dark:bg-persian-blue-900/30 text-persian-blue-600 dark:text-persian-blue-400 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{meeting.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {meeting.count} ({meeting.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-persian-blue-600 h-1.5 rounded-full"
                        style={{ width: `${meeting.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productivity Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
            <CardDescription>Key insights about your work patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productivityInsights.map((insight) => (
                <div key={insight.title} className="flex gap-4 p-4 rounded-lg border">
                  <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${insight.color}`}>
                    <insight.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{insight.title}</h3>
                    <p className="text-lg font-semibold mt-1">{insight.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
