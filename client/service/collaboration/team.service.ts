import { api, getErrorMessage } from '../../config/axios';
import {
  CreateTeamRequest,
  UpdateTeamRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  CreateRitualRequest,
  UpdateRitualRequest,
  GetAvailabilityHeatmapRequest,
  FindOptimalTimeRequest,
  TeamResponse,
  TeamsResponse,
  TeamMemberResponse,
  TeamMembersResponse,
  TeamRitualResponse,
  TeamRitualsResponse,
  AvailabilityHeatmapResponse,
  OptimalTimesResponse,
} from '../../interface';

const BASE_URL = '/teams';

export const getMyTeams = async (): Promise<TeamsResponse> => {
  try {
    const response = await api.get<TeamsResponse>(BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getOwnedTeams = async (): Promise<TeamsResponse> => {
  try {
    const response = await api.get<TeamsResponse>(`${BASE_URL}/owned`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeamById = async (teamId: string): Promise<TeamResponse> => {
  try {
    const response = await api.get<TeamResponse>(`${BASE_URL}/${teamId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createTeam = async (data: CreateTeamRequest): Promise<TeamResponse> => {
  try {
    const response = await api.post<TeamResponse>(BASE_URL, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTeam = async (
  teamId: string,
  data: UpdateTeamRequest
): Promise<TeamResponse> => {
  try {
    const response = await api.put<TeamResponse>(`${BASE_URL}/${teamId}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${teamId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeamMembers = async (
  teamId: string,
  status?: string
): Promise<TeamMembersResponse> => {
  try {
    const response = await api.get<TeamMembersResponse>(
      `${BASE_URL}/${teamId}/members`,
      {
        params: { status },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const inviteMember = async (
  teamId: string,
  data: InviteMemberRequest
): Promise<TeamMemberResponse> => {
  try {
    const response = await api.post<TeamMemberResponse>(
      `${BASE_URL}/${teamId}/members`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const acceptInvitation = async (
  teamId: string,
  memberId: string
): Promise<TeamMemberResponse> => {
  try {
    const response = await api.put<TeamMemberResponse>(
      `${BASE_URL}/${teamId}/members/${memberId}/accept`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const declineInvitation = async (
  teamId: string,
  memberId: string
): Promise<void> => {
  try {
    await api.put(
      `${BASE_URL}/${teamId}/members/${memberId}/decline`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateMemberRole = async (
  teamId: string,
  memberId: string,
  data: UpdateMemberRoleRequest
): Promise<TeamMemberResponse> => {
  try {
    const response = await api.put<TeamMemberResponse>(
      `${BASE_URL}/${teamId}/members/${memberId}/role`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const removeMember = async (teamId: string, memberId: string): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${teamId}/members/${memberId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const leaveTeam = async (teamId: string): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/${teamId}/leave`, {}, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeamRituals = async (
  teamId: string,
  activeOnly?: boolean
): Promise<TeamRitualsResponse> => {
  try {
    const response = await api.get<TeamRitualsResponse>(
      `${BASE_URL}/${teamId}/rituals`,
      {
        params: { active: activeOnly },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createRitual = async (
  teamId: string,
  data: CreateRitualRequest
): Promise<TeamRitualResponse> => {
  try {
    const response = await api.post<TeamRitualResponse>(
      `${BASE_URL}/${teamId}/rituals`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateRitual = async (
  teamId: string,
  ritualId: string,
  data: UpdateRitualRequest
): Promise<TeamRitualResponse> => {
  try {
    const response = await api.put<TeamRitualResponse>(
      `${BASE_URL}/${teamId}/rituals/${ritualId}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteRitual = async (teamId: string, ritualId: string): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${teamId}/rituals/${ritualId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getRotationHistory = async (teamId: string, ritualId: string): Promise<any> => {
  try {
    const response = await api.get(
      `${BASE_URL}/${teamId}/rituals/${ritualId}/rotation`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAvailabilityHeatmap = async (
  teamId: string,
  data: GetAvailabilityHeatmapRequest
): Promise<AvailabilityHeatmapResponse> => {
  try {
    const response = await api.post<AvailabilityHeatmapResponse>(
      `${BASE_URL}/${teamId}/availability/heatmap`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const findOptimalTimes = async (
  teamId: string,
  data: FindOptimalTimeRequest
): Promise<OptimalTimesResponse> => {
  try {
    const response = await api.post<OptimalTimesResponse>(
      `${BASE_URL}/${teamId}/availability/optimal`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const teamService = {
  getMyTeams,
  getOwnedTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  inviteMember,
  acceptInvitation,
  declineInvitation,
  updateMemberRole,
  removeMember,
  leaveTeam,
  getTeamRituals,
  createRitual,
  updateRitual,
  deleteRitual,
  getRotationHistory,
  getAvailabilityHeatmap,
  findOptimalTimes,
};

export default teamService;

