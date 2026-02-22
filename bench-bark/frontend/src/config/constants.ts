export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  DOGS: '/dogs',
  DOG_NEW: '/dogs/new',
  DOG_DETAIL: '/dogs/:id',
  DOG_EDIT: '/dogs/:id/edit',
  LESSONS: '/lessons',
  CATEGORY: '/lessons/category/:id',
  LESSON_DETAIL: '/lessons/:id',
  ADMIN_LESSONS: '/admin/lessons',
  ADMIN_LESSON_NEW: '/admin/lessons/new',
  ADMIN_LESSON_EDIT: '/admin/lessons/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
} as const;

export const WEIGHT_UNITS = ['lbs', 'kg'] as const;
export type WeightUnit = typeof WEIGHT_UNITS[number];
