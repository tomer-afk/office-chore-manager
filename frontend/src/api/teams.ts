import { apiClient } from './client';
import type { Team, TeamMember, CreateTeamInput, AddMemberInput } from '../types/team';

interface TeamsResponse {
  success: boolean;
  data: {
    teams: Team[];
  };
}

interface TeamResponse {
  success: boolean;
  data: {
    team: Team;
  };
}

interface MembersResponse {
  success: boolean;
  data: {
    members: TeamMember[];
  };
}

export const teamsApi = {
  getTeams: async (): Promise<Team[]> => {
    const { data } = await apiClient.get<TeamsResponse>('/teams');
    return data.data.teams;
  },

  getTeam: async (id: number): Promise<Team> => {
    const { data } = await apiClient.get<TeamResponse>(`/teams/${id}`);
    return data.data.team;
  },

  createTeam: async (input: CreateTeamInput): Promise<Team> => {
    const { data } = await apiClient.post<TeamResponse>('/teams', input);
    return data.data.team;
  },

  updateTeam: async (id: number, input: Partial<CreateTeamInput>): Promise<Team> => {
    const { data} = await apiClient.put<TeamResponse>(`/teams/${id}`, input);
    return data.data.team;
  },

  deleteTeam: async (id: number): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },

  getMembers: async (teamId: number): Promise<TeamMember[]> => {
    const { data } = await apiClient.get<MembersResponse>(`/teams/${teamId}/members`);
    return data.data.members;
  },

  addMember: async (teamId: number, input: AddMemberInput): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/members`, input);
  },

  addMemberByEmail: async (teamId: number, email: string, role?: 'admin' | 'member'): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/members`, { email, role: role || 'member' });
  },

  removeMember: async (teamId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
  },
};
