-- Create chore_completions table for tracking completion history
CREATE TABLE chore_completions (
  id SERIAL PRIMARY KEY,
  chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE NOT NULL,
  parent_chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE, -- link to recurring template
  completed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  completion_date DATE NOT NULL, -- the date this completion was for
  completed_on_time BOOLEAN, -- was it completed before due date
  notes TEXT, -- optional notes about the completion

  UNIQUE(chore_id, completion_date) -- prevent duplicate completions for same date
);

-- Create indexes
CREATE INDEX idx_completions_chore_id ON chore_completions(chore_id);
CREATE INDEX idx_completions_parent_id ON chore_completions(parent_chore_id);
CREATE INDEX idx_completions_date ON chore_completions(completion_date);
CREATE INDEX idx_completions_user ON chore_completions(completed_by);
