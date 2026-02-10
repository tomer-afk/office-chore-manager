-- Update status check constraint to include 'active'
ALTER TABLE chores DROP CONSTRAINT IF EXISTS chores_status_check;

ALTER TABLE chores
ADD CONSTRAINT chores_status_check
CHECK (status IN ('active', 'pending', 'in_progress', 'completed', 'overdue', 'archived'));

-- Update default status to 'active'
ALTER TABLE chores
ALTER COLUMN status SET DEFAULT 'active';
