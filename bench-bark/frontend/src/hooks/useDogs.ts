import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dogsApi } from '../api/dogs';
import type { CreateDogInput, UpdateDogInput } from '../types/dog';

export function useDogs() {
  return useQuery({
    queryKey: ['dogs'],
    queryFn: dogsApi.getDogs,
  });
}

export function useDog(id: number) {
  return useQuery({
    queryKey: ['dogs', id],
    queryFn: () => dogsApi.getDog(id),
    enabled: !!id,
  });
}

export function useCreateDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDogInput) => dogsApi.createDog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast.success('Dog added!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to add dog');
    },
  });
}

export function useUpdateDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDogInput }) => dogsApi.updateDog(id, data),
    onSuccess: (dog) => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      queryClient.setQueryData(['dogs', dog.id], dog);
      toast.success('Dog updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update dog');
    },
  });
}

export function useDeleteDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dogsApi.deleteDog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      toast.success('Dog removed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete dog');
    },
  });
}

export function useAnalyzePhoto() {
  return useMutation({
    mutationFn: (file: File) => dogsApi.analyzePhoto(file),
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to analyze photo');
    },
  });
}

export function useUploadDogPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => dogsApi.uploadPhoto(id, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      queryClient.setQueryData(['dogs', data.dog.id], data.dog);
      if (data.ai_analysis) {
        toast.success('Photo uploaded! AI detected breed and age.');
      } else {
        toast.success('Photo uploaded!');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to upload photo');
    },
  });
}
