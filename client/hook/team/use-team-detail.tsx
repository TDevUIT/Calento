'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { teamService } from '@/service';
import { TeamResponse } from '@/interface';
import { TEAM_QUERY_KEYS } from './query-keys';

export const useTeamDetail = (teamId: string): UseQueryResult<TeamResponse, Error> => {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.detail(teamId),
    queryFn: () => teamService.getTeamById(teamId),
    staleTime: 5 * 60 * 1000,
    enabled: !!teamId,
  });
};
