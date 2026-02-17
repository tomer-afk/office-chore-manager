import client from './client';
import type { Lesson, CreateLessonInput, UpdateLessonInput, ProgressResponse } from '../types/lesson';

export const lessonsApi = {
  getLessons: (categoryId?: number) => {
    const params = categoryId ? { category_id: categoryId } : {};
    return client.get<{ lessons: Lesson[] }>('/lessons', { params }).then((r) => r.data.lessons);
  },

  getLesson: (id: number) =>
    client.get<{ lesson: Lesson }>(`/lessons/${id}`).then((r) => r.data.lesson),

  createLesson: (data: CreateLessonInput) =>
    client.post<{ lesson: Lesson }>('/lessons', data).then((r) => r.data.lesson),

  updateLesson: (id: number, data: UpdateLessonInput) =>
    client.put<{ lesson: Lesson }>(`/lessons/${id}`, data).then((r) => r.data.lesson),

  deleteLesson: (id: number) =>
    client.delete(`/lessons/${id}`).then((r) => r.data),

  markAsRead: (id: number) =>
    client.post(`/lessons/${id}/read`).then((r) => r.data),

  getProgress: () =>
    client.get<{ progress: ProgressResponse }>('/lessons/progress').then((r) => r.data.progress),
};
