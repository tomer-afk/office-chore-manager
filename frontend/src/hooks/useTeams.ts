import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teams';
import toast from 'react-hot-toast';
import type { CreateTeamInput } from '../types/team';

export const useTeams = () => {
  const queryClient = useQueryClient();

  // Get all teams for current user
  const {
    data: teams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: (input: CreateTeamInput) => teamsApi.createTeam(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create team');
    },
  });

  return {
    teams,
    isLoading,
    error,
    createTeam: createTeamMutation.mutate,
    isCreating: createTeamMutation.isPending,
  };
};

// Hook for single team
export const useTeam = (id: number) => {
  const {
    data: team,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.getTeam(id),
    enabled: !!id,
  });

  return { team, isLoading, error };
};
