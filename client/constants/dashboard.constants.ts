import { Calendar, Clock, Users, TrendingUp, Settings, BarChart3, Calendar1, Plus, Bell, Zap, Star } from "lucide-react";

// Dashboard Types
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
  color: string;
}

// Dashboard Configuration
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
    { title: "Team Meeting", time: "10:00 AM", color: "bg-blue-500" },
  ],
  15: [
    { title: "Client Call", time: "2:00 PM", color: "bg-blue-600" },
  ],
  22: [{ title: "Workshop", time: "9:00 AM", color: "bg-slate-600" }],
  28: [{ title: "Presentation", time: "3:00 PM", color: "bg-slate-700" }],
};

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// Dashboard Styling Constants
export const DASHBOARD_STYLES = {
  container: "w-full h-full bg-white rounded-xl flex overflow-hidden mt-10 shadow-lg border border-slate-100",
  sidebar: {
    container: "w-40 h-full bg-white border-r border-slate-200 flex flex-col",
    logo: "mt-4 mb-3 px-2",
    nav: "flex-1 p-1.5",
    navList: "space-y-1",
    navItem: {
      base: "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
      active: "bg-blue-50 text-blue-600",
      inactive: "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
    },
    badge: "bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center",
    footer: "p-2 border-t border-slate-200",
    newEventButton: "w-full flex items-center justify-center space-x-1 px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
  },
  main: {
    container: "flex-1 flex flex-col h-full",
    content: "flex-1 flex flex-col bg-slate-50 overflow-hidden",
    header: "flex items-center justify-between p-3 bg-white border-b border-slate-200",
    headerIcon: "p-2 bg-blue-50 rounded-lg",
    headerTitle: "text-lg font-bold text-slate-900",
    headerSubtitle: "text-xs text-slate-500"
  },
  calendar: {
    container: "bg-white h-full flex flex-col",
    navigation: "flex items-center justify-between p-3 border-b border-slate-200",
    navButton: "p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors",
    monthTitle: "text-sm font-semibold text-slate-900 min-w-[120px] text-center",
    todayButton: "px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors",
    grid: "flex-1 p-3",
    daysHeader: "grid grid-cols-7 border border-slate-200 bg-slate-50",
    dayHeader: "text-center text-xs font-semibold text-slate-600 py-3",
    daysGrid: "grid grid-cols-7 border-l border-r border-b border-slate-200",
    dayCell: {
      base: "relative min-h-[60px] border-b border-slate-200",
      content: "w-full h-full cursor-pointer",
      today: "bg-blue-50",
      normal: "bg-white hover:bg-slate-50",
      empty: "bg-slate-25"
    },
    event: {
      base: "text-xs py-1 rounded-md text-white font-medium border-l-2 border-white/30 hover:shadow-md transition-shadow cursor-pointer",
      time: "text-xs opacity-75 ml-1 text-white",
      moreIndicator: "text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md text-center font-medium"
    }
  }
} as const;
