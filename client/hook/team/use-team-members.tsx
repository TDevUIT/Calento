'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { teamService } from '@/service/team.service';
import { 
  TeamMembersResponse, 
  TeamMemberResponse,
  InviteMemberRequest,
  UpdateMemberRoleRequest 
} from '@/interface/team.interface';
import { TEAM_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useTeamMembers = (
  teamId: string,
  status?: string
): UseQueryResult<TeamMembersResponse, Error> => {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.members(teamId, status),
    queryFn: () => teamService.getTeamMembers(teamId, status),
    staleTime: 3 * 60 * 1000,
    enabled: !!teamId,
  });
};

interface InviteMemberParams {
  teamId: string;
  data: InviteMemberRequest;
}

export const useInviteMember = (): UseMutationResult<TeamMemberResponse, Error, InviteMemberParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: InviteMemberParams) => 
      teamService.inviteMember(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members(teamId) });
      toast.success('Member invited successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to invite member', {
        description: error.message,
      });
    },
  });
};

interface AcceptInvitationParams {
  teamId: string;
  memberId: string;
}

export const useAcceptInvitation = (): UseMutationResult<TeamMemberResponse, Error, AcceptInvitationParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, memberId }: AcceptInvitationParams) => 
      teamService.acceptInvitation(teamId, memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members(teamId) });
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.lists() });
      toast.success('Invitation accepted!');
    },
    onError: (error: Error) => {
      toast.error('Failed to accept invitation', {
        description: error.message,
      });
    },
  });
};

interface DeclineInvitationParams {
  teamId: string;
  memberId: string;
}

export const useDeclineInvitation = (): UseMutationResult<void, Error, DeclineInvitationParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, memberId }: DeclineInvitationParams) => 
      teamService.declineInvitation(teamId, memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members(teamId) });
      toast.success('Invitation declined');
    },
    onError: (error: Error) => {
      toast.error('Failed to decline invitation', {
        description: error.message,
      });
    },
  });
};

interface UpdateMemberRoleParams {
  teamId: string;
  memberId: string;
  data: UpdateMemberRoleRequest;
}

export const useUpdateMemberRole = (): UseMutationResult<TeamMemberResponse, Error, UpdateMemberRoleParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, memberId, data }: UpdateMemberRoleParams) => 
      teamService.updateMemberRole(teamId, memberId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members(teamId) });
      toast.success('Member role updated!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update role', {
        description: error.message,
      });
    },
  });
};

interface RemoveMemberParams {
  teamId: string;
  memberId: string;
}

export const useRemoveMember = (): UseMutationResult<void, Error, RemoveMemberParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, memberId }: RemoveMemberParams) => 
      teamService.removeMember(teamId, memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members(teamId) });
      toast.success('Member removed');
    },
    onError: (error: Error) => {
      toast.error('Failed to remove member', {
        description: error.message,
      });
    },
  });
};

export const useLeaveTeam = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => teamService.leaveTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.all });
      toast.success('Left team successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to leave team', {
        description: error.message,
      });
    },
  });
};
