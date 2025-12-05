export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  timezone: string;
  settings: TeamSettings;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  joined_at?: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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

export interface TeamAvailabilityHeatmap {
  team_id: string;
  date_range: {
    start: string;
    end: string;
  };
  timezone: string;
  slots: HeatmapSlot[];
  members: any[];
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

export interface CreateTeamRequest {
  name: string;
  description?: string;
  timezone?: string;
  settings?: Partial<TeamSettings>;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  timezone?: string;
  settings?: Partial<TeamSettings>;
  is_active?: boolean;
}

export interface InviteMemberRequest {
  email: string;
  role?: 'admin' | 'member';
}

export interface UpdateMemberRoleRequest {
  role: 'admin' | 'member';
}

export interface CreateRitualRequest {
  title: string;
  description?: string;
  recurrence_rule: string;
  duration_minutes?: number;
  buffer_before?: number;
  buffer_after?: number;
  rotation_type?: 'none' | 'round_robin' | 'random' | 'load_balanced';
  rotation_order?: string[];
}

export interface UpdateRitualRequest {
  title?: string;
  description?: string;
  recurrence_rule?: string;
  duration_minutes?: number;
  buffer_before?: number;
  buffer_after?: number;
  rotation_type?: 'none' | 'round_robin' | 'random' | 'load_balanced';
  rotation_order?: string[];
  is_active?: boolean;
}

export interface GetAvailabilityHeatmapRequest {
  start_date: string;
  end_date: string;
  timezone?: string;
}

export interface FindOptimalTimeRequest {
  start_date: string;
  end_date: string;
  duration_minutes: number;
  required_members?: string[];
  timezone?: string;
}

export interface TeamResponse {
  success: boolean;
  data: Team;
}

export interface TeamsResponse {
  success: boolean;
  data: Team[];
}

export interface TeamMemberResponse {
  success: boolean;
  data: TeamMember;
}

export interface TeamMembersResponse {
  success: boolean;
  data: TeamMember[];
}

export interface TeamRitualResponse {
  success: boolean;
  data: TeamRitual;
}

export interface TeamRitualsResponse {
  success: boolean;
  data: TeamRitual[];
}

export interface AvailabilityHeatmapResponse {
  success: boolean;
  data: TeamAvailabilityHeatmap;
}

export interface OptimalTimesResponse {
  success: boolean;
  data: OptimalMeetingTime[];
}
