-- Create chores table
CREATE TABLE chores (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  color VARCHAR(7) DEFAULT '#3B82F6', -- hex color code
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

  -- Recurrence fields
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'custom')),
  recurrence_interval INTEGER, -- for custom intervals (e.g., every N days)
  recurrence_days_of_week INTEGER[], -- array for weekly (0=Sun, 6=Sat)
  recurrence_day_of_month INTEGER CHECK (recurrence_day_of_month BETWEEN 1 AND 31), -- for monthly
  recurrence_end_date DATE, -- optional end date for recurrence

  -- Template tracking for recurring chores
  is_template BOOLEAN DEFAULT FALSE, -- TRUE for recurring rule, FALSE for instances
  parent_chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE,

  -- Date tracking
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date TIMESTAMP,
  next_occurrence DATE, -- computed field for recurring chores

  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'archived')),
  completed_at TIMESTAMP,
  completed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_chores_team_id ON chores(team_id);
CREATE INDEX idx_chores_assigned_to ON chores(assigned_to);
CREATE INDEX idx_chores_due_date ON chores(due_date);
CREATE INDEX idx_chores_next_occurrence ON chores(next_occurrence);
CREATE INDEX idx_chores_parent_id ON chores(parent_chore_id);
CREATE INDEX idx_chores_is_template ON chores(is_template);
CREATE INDEX idx_chores_status ON chores(status);

-- Composite index for common queries
CREATE INDEX idx_chores_team_status ON chores(team_id, status);
CREATE INDEX idx_chores_assigned_status ON chores(assigned_to, status);

-- Create trigger for chores table
CREATE TRIGGER update_chores_updated_at BEFORE UPDATE ON chores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
