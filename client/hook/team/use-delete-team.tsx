'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { teamService } from '@/service/team.service';
import { TEAM_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useDeleteTeam = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => teamService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: TEAM_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Team deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete team', {
        description: error.message,
      });
    },
  });
};
