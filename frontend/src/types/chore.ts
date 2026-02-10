export type ChorePriority = 'low' | 'medium' | 'high';
export type ChoreStatus = 'active' | 'completed' | 'archived';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Chore {
  id: number;
  team_id: number;
  title: string;
  description?: string;
  priority: ChorePriority;
  color: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_to_avatar?: string;
  created_by: number;
  created_by_name?: string;
  start_date?: string;
  due_date: string;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_interval?: number;
  recurrence_days_of_week?: number[]; // 0-6 (Sunday-Saturday)
  recurrence_day_of_month?: number; // 1-31
  recurrence_end_date?: string;
  is_template: boolean;
  parent_chore_id?: number;
  status: ChoreStatus;
  completed_at?: string;
  completed_by?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateChoreInput {
  title: string;
  description?: string;
  priority?: ChorePriority;
  color?: string;
  assigned_to?: number;
  start_date?: string;
  due_date: string;
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_interval?: number;
  recurrence_days_of_week?: number[];
  recurrence_day_of_month?: number;
  recurrence_end_date?: string;
}

export interface UpdateChoreInput {
  title?: string;
  description?: string;
  priority?: ChorePriority;
  color?: string;
  assigned_to?: number;
  start_date?: string;
  due_date?: string;
  status?: ChoreStatus;
  recurrence_pattern?: RecurrencePattern;
  recurrence_interval?: number;
  recurrence_days_of_week?: number[];
  recurrence_day_of_month?: number;
  recurrence_end_date?: string;
}

export interface ChoreCompletion {
  id: number;
  chore_id: number;
  completed_by: number;
  completed_by_name?: string;
  completed_at: string;
  completion_date: string;
  notes?: string;
}

export interface ChoresResponse {
  success: boolean;
  data: {
    chores: Chore[];
  };
}

export interface ChoreResponse {
  success: boolean;
  data: {
    chore: Chore;
  };
  message?: string;
}

export interface ChoreHistoryResponse {
  success: boolean;
  data: {
    history: ChoreCompletion[];
  };
}
