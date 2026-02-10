import { useQuery } from '@tanstack/react-query';
import { teamsApi } from '../api/teams';

export const useTeamMembers = (teamId: number) => {
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => teamsApi.getMembers(teamId),
    enabled: !!teamId,
  });

  return { members, isLoading, error };
};
