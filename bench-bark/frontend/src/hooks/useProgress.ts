import { useQuery } from '@tanstack/react-query';
import { lessonsApi } from '../api/lessons';

export function useProgress() {
  return useQuery({
    queryKey: ['progress'],
    queryFn: lessonsApi.getProgress,
  });
}
