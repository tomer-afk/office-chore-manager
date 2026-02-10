export interface Team {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  role?: 'admin' | 'member';
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
}

export interface AddMemberInput {
  userId: number;
  role?: 'admin' | 'member';
}
