import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { choresApi } from '../api/chores';
import toast from 'react-hot-toast';
import type { CreateChoreInput, UpdateChoreInput } from '../types/chore';

export const useChores = (teamId: number, filters?: any) => {
  const queryClient = useQueryClient();

  // Get all chores for a team
  const {
    data: chores = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chores', teamId, filters],
    queryFn: () => choresApi.getChores(teamId, filters),
    enabled: !!teamId,
  });

  // Create chore mutation
  const createChoreMutation = useMutation({
    mutationFn: (input: CreateChoreInput) =>
      choresApi.createChore(teamId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores', teamId] });
      toast.success('Chore created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create chore');
    },
  });

  // Update chore mutation
  const updateChoreMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateChoreInput }) =>
      choresApi.updateChore(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores', teamId] });
      toast.success('Chore updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update chore');
    },
  });

  // Delete chore mutation
  const deleteChoreMutation = useMutation({
    mutationFn: (id: number) => choresApi.deleteChore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores', teamId] });
      toast.success('Chore deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete chore');
    },
  });

  // Complete chore mutation
  const completeChoreMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      choresApi.completeChore(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores', teamId] });
      toast.success('Chore marked as complete!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to complete chore');
    },
  });

  return {
    chores,
    isLoading,
    error,
    createChore: createChoreMutation.mutate,
    updateChore: updateChoreMutation.mutate,
    deleteChore: deleteChoreMutation.mutate,
    completeChore: completeChoreMutation.mutate,
    isCreating: createChoreMutation.isPending,
    isUpdating: updateChoreMutation.isPending,
    isDeleting: deleteChoreMutation.isPending,
    isCompleting: completeChoreMutation.isPending,
  };
};

// Hook for single chore
export const useChore = (id: number) => {
  const {
    data: chore,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chore', id],
    queryFn: () => choresApi.getChore(id),
    enabled: !!id,
  });

  return { chore, isLoading, error };
};

// Hook for chore history
export const useChoreHistory = (id: number) => {
  const {
    data: history = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chore-history', id],
    queryFn: () => choresApi.getChoreHistory(id),
    enabled: !!id,
  });

  return { history, isLoading, error };
};

// Hook for calendar data
export const useCalendarData = (
  teamId: number,
  startDate: string,
  endDate: string
) => {
  const {
    data: chores = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['calendar', teamId, startDate, endDate],
    queryFn: () => choresApi.getCalendarData(teamId, startDate, endDate),
    enabled: !!teamId && !!startDate && !!endDate,
  });

  return { chores, isLoading, error };
};
