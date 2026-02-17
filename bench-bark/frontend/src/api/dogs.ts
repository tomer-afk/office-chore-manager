import client from './client';
import type { Dog, CreateDogInput, UpdateDogInput, PhotoAnalysisResponse } from '../types/dog';

export const dogsApi = {
  getDogs: () =>
    client.get<{ dogs: Dog[] }>('/dogs').then((r) => r.data.dogs),

  getDog: (id: number) =>
    client.get<{ dog: Dog }>(`/dogs/${id}`).then((r) => r.data.dog),

  createDog: (data: CreateDogInput) =>
    client.post<{ dog: Dog }>('/dogs', data).then((r) => r.data.dog),

  updateDog: (id: number, data: UpdateDogInput) =>
    client.put<{ dog: Dog }>(`/dogs/${id}`, data).then((r) => r.data.dog),

  deleteDog: (id: number) =>
    client.delete(`/dogs/${id}`).then((r) => r.data),

  uploadPhoto: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return client.post<PhotoAnalysisResponse>(`/dogs/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
};
