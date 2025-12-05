'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { teamService } from '@/service';
import { CreateTeamRequest, TeamResponse } from '@/interface';
import { TEAM_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useCreateTeam = (): UseMutationResult<TeamResponse, Error, CreateTeamRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => teamService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: TEAM_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Team created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create team', {
        description: error.message,
      });
    },
  });
};
