'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { teamService } from '@/service';
import { TeamsResponse } from '@/interface/team.interface';
import { TEAM_QUERY_KEYS } from './query-keys';

export const useTeams = (): UseQueryResult<TeamsResponse, Error> => {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.myTeams(),
    queryFn: () => teamService.getMyTeams(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useOwnedTeams = (): UseQueryResult<TeamsResponse, Error> => {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.ownedTeams(),
    queryFn: () => teamService.getOwnedTeams(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
