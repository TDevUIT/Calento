'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { teamService } from '@/service';
import { 
  TeamRitualsResponse, 
  TeamRitualResponse,
  CreateRitualRequest,
  UpdateRitualRequest 
} from '@/interface';
import { TEAM_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useTeamRituals = (
  teamId: string,
  activeOnly?: boolean
): UseQueryResult<TeamRitualsResponse, Error> => {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.rituals(teamId, activeOnly),
    queryFn: () => teamService.getTeamRituals(teamId, activeOnly),
    staleTime: 5 * 60 * 1000,
    enabled: !!teamId,
  });
};

interface CreateRitualParams {
  teamId: string;
  data: CreateRitualRequest;
}

export const useCreateRitual = (): UseMutationResult<TeamRitualResponse, Error, CreateRitualParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: CreateRitualParams) => 
      teamService.createRitual(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.rituals(teamId) });
      toast.success('Ritual created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create ritual', {
        description: error.message,
      });
    },
  });
};

interface UpdateRitualParams {
  teamId: string;
  ritualId: string;
  data: UpdateRitualRequest;
}

export const useUpdateRitual = (): UseMutationResult<TeamRitualResponse, Error, UpdateRitualParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, ritualId, data }: UpdateRitualParams) => 
      teamService.updateRitual(teamId, ritualId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.rituals(teamId) });
      toast.success('Ritual updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update ritual', {
        description: error.message,
      });
    },
  });
};

interface DeleteRitualParams {
  teamId: string;
  ritualId: string;
}

export const useDeleteRitual = (): UseMutationResult<void, Error, DeleteRitualParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, ritualId }: DeleteRitualParams) => 
      teamService.deleteRitual(teamId, ritualId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.rituals(teamId) });
      toast.success('Ritual deleted');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete ritual', {
        description: error.message,
      });
    },
  });
};

export const useRotationHistory = (
  teamId: string,
  ritualId: string
): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.rotationHistory(teamId, ritualId),
    queryFn: () => teamService.getRotationHistory(teamId, ritualId),
    staleTime: 2 * 60 * 1000,
    enabled: !!teamId && !!ritualId,
  });
};
