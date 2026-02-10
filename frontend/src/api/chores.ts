import { apiClient } from './client';
import type {
  Chore,
  CreateChoreInput,
  UpdateChoreInput,
  ChoreCompletion,
  ChoresResponse,
  ChoreResponse,
  ChoreHistoryResponse,
} from '../types/chore';

export const choresApi = {
  getChores: async (
    teamId: number,
    filters?: {
      assigned_to?: number;
      status?: string;
      priority?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<Chore[]> => {
    const { data } = await apiClient.get<ChoresResponse>(
      `/teams/${teamId}/chores`,
      { params: filters }
    );
    return data.data.chores;
  },

  getChore: async (id: number): Promise<Chore> => {
    const { data } = await apiClient.get<ChoreResponse>(`/chores/${id}`);
    return data.data.chore;
  },

  createChore: async (
    teamId: number,
    input: CreateChoreInput
  ): Promise<Chore> => {
    const { data } = await apiClient.post<ChoreResponse>(
      `/teams/${teamId}/chores`,
      input
    );
    return data.data.chore;
  },

  updateChore: async (id: number, input: UpdateChoreInput): Promise<Chore> => {
    const { data } = await apiClient.put<ChoreResponse>(`/chores/${id}`, input);
    return data.data.chore;
  },

  deleteChore: async (id: number): Promise<void> => {
    await apiClient.delete(`/chores/${id}`);
  },

  completeChore: async (id: number, notes?: string): Promise<Chore> => {
    const { data } = await apiClient.post<ChoreResponse>(
      `/chores/${id}/complete`,
      { notes }
    );
    return data.data.chore;
  },

  getChoreHistory: async (id: number): Promise<ChoreCompletion[]> => {
    const { data } = await apiClient.get<ChoreHistoryResponse>(
      `/chores/${id}/history`
    );
    return data.data.history;
  },

  getCalendarData: async (
    teamId: number,
    start_date: string,
    end_date: string
  ): Promise<Chore[]> => {
    const { data } = await apiClient.get<ChoresResponse>(
      `/teams/${teamId}/calendar`,
      { params: { start_date, end_date } }
    );
    return data.data.chores;
  },
};
