import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { lessonsApi } from '../api/lessons';
import type { CreateLessonInput, UpdateLessonInput } from '../types/lesson';

export function useLessons(categoryId?: number) {
  return useQuery({
    queryKey: ['lessons', categoryId],
    queryFn: () => lessonsApi.getLessons(categoryId),
  });
}

export function useLesson(id: number) {
  return useQuery({
    queryKey: ['lessons', 'detail', id],
    queryFn: () => lessonsApi.getLesson(id),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLessonInput) => lessonsApi.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson created!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create lesson');
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLessonInput }) => lessonsApi.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update lesson');
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lessonsApi.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete lesson');
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lessonsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}
