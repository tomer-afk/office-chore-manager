import client from './client';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category';

export const categoriesApi = {
  getCategories: () =>
    client.get<{ categories: Category[] }>('/categories').then((r) => r.data.categories),

  getCategory: (id: number) =>
    client.get<{ category: Category }>(`/categories/${id}`).then((r) => r.data.category),

  createCategory: (data: CreateCategoryInput) =>
    client.post<{ category: Category }>('/categories', data).then((r) => r.data.category),

  updateCategory: (id: number, data: UpdateCategoryInput) =>
    client.put<{ category: Category }>(`/categories/${id}`, data).then((r) => r.data.category),

  deleteCategory: (id: number) =>
    client.delete(`/categories/${id}`).then((r) => r.data),
};
