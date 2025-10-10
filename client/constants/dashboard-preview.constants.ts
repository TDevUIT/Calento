import { Calendar, Clock, RefreshCw, Video, BarChart3, Settings, Users, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  icon: LucideIcon;
  label: string;
  active: boolean;
  badge?: number;
}

export interface AIMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIAnalysisStep {
  type: 'success' | 'skipped' | 'highlight';
  text: string;
  icon?: string;
}

export interface SuggestedMeeting {
  title: string;
  date: string;
  time: string;
  attendees: number;
  availability: string;
}

export interface QuickAction {
  label: string;
  icon: LucideIcon;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { icon: Calendar, label: 'Calendar', active: true, badge: 8 },
  { icon: Clock, label: 'Schedule', active: false },
  { icon: RefreshCw, label: 'Calendar Sync', active: false },
  { icon: Video, label: 'Meetings', active: false },
  { icon: BarChart3, label: 'Analytics', active: false }
];

export const WORKSPACE_CONFIG = {
  name: 'My Workspace',
  userStatus: 'Online'
} as const;

export const CREDITS_CONFIG = {
  available: 1304,
  label: 'Credits left',
  upgradeText: 'Upgrade'
} as const;

export const SIDEBAR_ACTIONS: Array<{
  icon: LucideIcon;
  label: string;
  badge?: string;
}> = [
  { icon: Settings, label: 'Settings' },
  { icon: Users, label: 'Affiliate', badge: '30%' },
  { icon: HelpCircle, label: 'Help' }
];

export const AI_CHAT_CONFIG = {
  title: 'Calento Assistant',
  placeholder: 'Ask about your schedule...',
  model: {
    name: 'GPT-4 Turbo',
    description: 'Calendar Intelligence',
    changeText: 'Change model'
  }
} as const;

export const SAMPLE_CONVERSATION = {
  userMessage: {
    content: 'Find me 1 hour this week to meet with the design team',
    timestamp: 'Just now'
  },
  aiAnalysis: {
    title: 'AI Analysis',
    duration: '1.2s',
    steps: [
      { type: 'success', text: 'Checked 4 team member calendars' },
      { type: 'success', text: 'Identified 5 mutual availability windows' },
      { type: 'skipped', text: 'Monday 9AM - back-to-back conflicts' },
      { type: 'skipped', text: 'Wednesday 3PM - end of day fatigue' },
      { type: 'highlight', text: '✓ Thursday 2PM - Peak productivity time' }
    ] as AIAnalysisStep[],
    matchScore: 92
  },
  aiResponse: {
    content: 'Perfect! I found an ideal time when everyone is available 🎯',
    timestamp: 'Now'
  },
  suggestedMeeting: {
    title: 'Design Team Sync',
    date: 'Thu, Nov 14',
    time: '2:00 - 3:00 PM',
    attendees: 4,
    availability: '100% available'
  } as SuggestedMeeting
} as const;

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Find time', icon: Clock },
  { label: 'Check calendar', icon: Calendar },
  { label: 'Reschedule', icon: RefreshCw }
];

export const QUICK_ACTIONS_LABEL = 'Quick actions';

export const MEETING_CTA = 'Schedule Meeting';

export const MATCH_SCORE_LABEL = 'Match Score';

export const formatCredits = (value: number): string => {
  return value.toLocaleString('en-US');
};
