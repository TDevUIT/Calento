export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  timezone: string;
  settings: TeamSettings;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TeamSettings {
  auto_buffer_enabled?: boolean;
  buffer_before_minutes?: number;
  buffer_after_minutes?: number;
  allow_member_invites?: boolean;
  require_approval?: boolean;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  status: 'pending' | 'active' | 'declined' | 'removed';
  joined_at?: Date;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
}

export interface TeamRitual {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  recurrence_rule: string;
  duration_minutes: number;
  buffer_before: number;
  buffer_after: number;
  rotation_type: 'none' | 'round_robin' | 'random' | 'load_balanced';
  rotation_order?: string[];
  current_rotation_index: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TeamAvailability {
  id: string;
  team_id: string;
  user_id: string;
  date: Date;
  available_slots: TimeSlot[];
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TeamMeetingRotation {
  id: string;
  ritual_id: string;
  user_id: string;
  scheduled_at: Date;
  event_id?: string;
  created_at: Date;
}

export interface TeamAvailabilityHeatmap {
  team_id: string;
  date_range: {
    start: Date;
    end: Date;
  };
  timezone: string;
  slots: HeatmapSlot[];
  members: TeamMemberAvailability[];
}

export interface HeatmapSlot {
  datetime: string;
  day: string;
  time: string;
  available_count: number;
  total_count: number;
  availability_percentage: number;
  available_members: string[];
}

export interface TeamMemberAvailability {
  user_id: string;
  name: string;
  email: string;
  timezone: string;
  availability: {
    date: string;
    slots: TimeSlot[];
  }[];
}

export interface OptimalMeetingTime {
  datetime: string;
  day: string;
  time: string;
  duration_minutes: number;
  availability_percentage: number;
  available_members: string[];
  score: number;
  timezone_conflicts: boolean;
  buffer_violations: number;
}
