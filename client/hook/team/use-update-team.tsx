'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { teamService } from '@/service/team.service';
import { UpdateTeamRequest, TeamResponse } from '@/interface/team.interface';
import { TEAM_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

interface UpdateTeamParams {
  teamId: string;
  data: UpdateTeamRequest;
}

export const useUpdateTeam = (): UseMutationResult<TeamResponse, Error, UpdateTeamParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: UpdateTeamParams) => teamService.updateTeam(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.detail(teamId) });
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.lists() });
      toast.success('Team updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update team', {
        description: error.message,
      });
    },
  });
};
