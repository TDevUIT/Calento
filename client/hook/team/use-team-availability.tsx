'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { teamService } from '@/service';
import { 
  GetAvailabilityHeatmapRequest,
  FindOptimalTimeRequest,
  AvailabilityHeatmapResponse,
  OptimalTimesResponse 
} from '@/interface';
import { TEAM_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

interface GetHeatmapParams {
  teamId: string;
  data: GetAvailabilityHeatmapRequest;
}

export const useGetAvailabilityHeatmap = (): UseMutationResult<
  AvailabilityHeatmapResponse, 
  Error, 
  GetHeatmapParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: GetHeatmapParams) => 
      teamService.getAvailabilityHeatmap(teamId, data),
    onSuccess: (result, { teamId, data }) => {
      queryClient.setQueryData(
        TEAM_QUERY_KEYS.heatmap(teamId, data.start_date, data.end_date),
        result
      );
    },
    onError: (error: Error) => {
      toast.error('Failed to load availability heatmap', {
        description: error.message,
      });
    },
  });
};

interface FindOptimalTimesParams {
  teamId: string;
  data: FindOptimalTimeRequest;
}

export const useFindOptimalTimes = (): UseMutationResult<
  OptimalTimesResponse, 
  Error, 
  FindOptimalTimesParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: FindOptimalTimesParams) => 
      teamService.findOptimalTimes(teamId, data),
    onSuccess: (result, { teamId, data }) => {
      queryClient.setQueryData(
        TEAM_QUERY_KEYS.optimalTimes(teamId, data),
        result
      );
    },
    onError: (error: Error) => {
      toast.error('Failed to find optimal times', {
        description: error.message,
      });
    },
  });
};
