-- Make start_date nullable in chores table
ALTER TABLE chores
ALTER COLUMN start_date DROP NOT NULL;
