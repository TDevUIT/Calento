import { Calendar, Clock, Users, TrendingUp, Settings, BarChart3 } from "lucide-react";

export interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: string | null;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface UpcomingMeeting {
  time: string;
  title: string;
  attendees: number;
}

export interface CalendarEvent {
  title: string;
  time: string;
  startHour: number;
  startMinute: number;
  duration: number; // in minutes
  color: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3, active: false, badge: null },
  { id: "calendar", name: "Calendar", icon: Calendar, active: true, badge: "8" },
  { id: "meetings", name: "Meetings", icon: Users, active: false, badge: "3" },
  { id: "analytics", name: "Analytics", icon: TrendingUp, active: false, badge: null },
  { id: "settings", name: "Settings", icon: Settings, active: false, badge: null },
];

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: "Today's Meetings", value: "8", change: "+12%", trend: "up" },
  { label: "This Week", value: "24", change: "+5%", trend: "up" },
];

export const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  { time: "10:00 AM", title: "Product Review", attendees: 5 },
  { time: "2:30 PM", title: "Client Call", attendees: 3 },
];

export const CALENDAR_EVENTS: Record<number, CalendarEvent[]> = {
  8: [
    { title: "Team Meeting", time: "10:00 AM", startHour: 10, startMinute: 0, duration: 60, color: "bg-blue-500" },
  ],
  15: [
    { title: "Client Call", time: "2:00 PM", startHour: 14, startMinute: 0, duration: 45, color: "bg-blue-600" },
  ],
  22: [{ title: "Workshop", time: "9:00 AM", startHour: 9, startMinute: 0, duration: 120, color: "bg-slate-600" }],
  28: [{ title: "Presentation", time: "3:00 PM", startHour: 15, startMinute: 0, duration: 90, color: "bg-slate-700" }],
};

export const WEEK_CALENDAR_EVENTS: Record<number, CalendarEvent[]> = {
  0: [], // Sunday
  1: [ // Monday
    { title: "Team Standup", time: "9:00 AM", startHour: 9, startMinute: 0, duration: 30, color: "bg-blue-500" },
    { title: "Project Review", time: "11:00 AM", startHour: 11, startMinute: 0, duration: 60, color: "bg-purple-500" },
    { title: "Lunch Break", time: "12:00 PM", startHour: 12, startMinute: 0, duration: 60, color: "bg-green-500" },
  ],
  2: [ // Tuesday
    { title: "Client Meeting", time: "10:00 AM", startHour: 10, startMinute: 0, duration: 90, color: "bg-indigo-500" },
    { title: "Design Review", time: "2:00 PM", startHour: 14, startMinute: 0, duration: 60, color: "bg-pink-500" },
  ],
  3: [ // Wednesday
    { title: "Product Demo", time: "9:30 AM", startHour: 9, startMinute: 30, duration: 45, color: "bg-orange-500" },
    { title: "1-on-1", time: "1:00 PM", startHour: 13, startMinute: 0, duration: 30, color: "bg-teal-500" },
    { title: "Workshop", time: "3:00 PM", startHour: 15, startMinute: 0, duration: 120, color: "bg-violet-500" },
  ],
  4: [ // Thursday
    { title: "Code Review", time: "10:00 AM", startHour: 10, startMinute: 0, duration: 45, color: "bg-cyan-500" },
    { title: "Sprint Planning", time: "2:30 PM", startHour: 14, startMinute: 30, duration: 90, color: "bg-blue-600" },
  ],
  5: [ // Friday
    { title: "All Hands", time: "9:00 AM", startHour: 9, startMinute: 0, duration: 60, color: "bg-red-500" },
    { title: "Team Lunch", time: "12:30 PM", startHour: 12, startMinute: 30, duration: 90, color: "bg-amber-500" },
    { title: "Happy Hour", time: "5:00 PM", startHour: 17, startMinute: 0, duration: 120, color: "bg-emerald-500" },
  ],
  6: [], // Saturday
};

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
