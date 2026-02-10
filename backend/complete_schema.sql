-- Complete Database Schema for Chore Manager
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE USERS TABLE
-- ============================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. CREATE TEAMS TABLES
-- ============================================

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(50) DEFAULT 'member' NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_teams_created_by ON teams(created_by);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. CREATE CHORES TABLE
-- ============================================

CREATE TABLE chores (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  color VARCHAR(7) DEFAULT '#3B82F6',
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

  -- Recurrence fields
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'custom')),
  recurrence_interval INTEGER,
  recurrence_days_of_week INTEGER[],
  recurrence_day_of_month INTEGER CHECK (recurrence_day_of_month BETWEEN 1 AND 31),
  recurrence_end_date DATE,

  -- Template tracking for recurring chores
  is_template BOOLEAN DEFAULT FALSE,
  parent_chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE,

  -- Date tracking
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date TIMESTAMP,
  next_occurrence DATE,

  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'archived')),
  completed_at TIMESTAMP,
  completed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_chores_team_id ON chores(team_id);
CREATE INDEX idx_chores_assigned_to ON chores(assigned_to);
CREATE INDEX idx_chores_due_date ON chores(due_date);
CREATE INDEX idx_chores_next_occurrence ON chores(next_occurrence);
CREATE INDEX idx_chores_parent_id ON chores(parent_chore_id);
CREATE INDEX idx_chores_is_template ON chores(is_template);
CREATE INDEX idx_chores_status ON chores(status);
CREATE INDEX idx_chores_team_status ON chores(team_id, status);
CREATE INDEX idx_chores_assigned_status ON chores(assigned_to, status);

CREATE TRIGGER update_chores_updated_at BEFORE UPDATE ON chores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. CREATE CHORE COMPLETIONS TABLE
-- ============================================

CREATE TABLE chore_completions (
  id SERIAL PRIMARY KEY,
  chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE NOT NULL,
  parent_chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE,
  completed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  completion_date DATE NOT NULL,
  completed_on_time BOOLEAN,
  notes TEXT,
  UNIQUE(chore_id, completion_date)
);

CREATE INDEX idx_completions_chore_id ON chore_completions(chore_id);
CREATE INDEX idx_completions_parent_id ON chore_completions(parent_chore_id);
CREATE INDEX idx_completions_date ON chore_completions(completion_date);
CREATE INDEX idx_completions_user ON chore_completions(completed_by);

-- ============================================
-- 5. CREATE NOTIFICATIONS TABLES
-- ============================================

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('due_soon', 'overdue', 'assigned', 'completed', 'general')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE TABLE user_notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  browser_notifications_enabled BOOLEAN DEFAULT FALSE,
  notify_when_due BOOLEAN DEFAULT TRUE,
  notify_when_overdue BOOLEAN DEFAULT TRUE,
  minutes_before_due INTEGER DEFAULT 60 CHECK (minutes_before_due >= 0 AND minutes_before_due <= 1440),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_queue (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE NOT NULL,
  notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('due_soon', 'overdue', 'assigned')),
  scheduled_for TIMESTAMP NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_queue_pending ON notification_queue(sent, scheduled_for);
CREATE INDEX idx_notification_queue_user ON notification_queue(user_id);

CREATE TRIGGER update_user_notification_preferences_updated_at BEFORE UPDATE ON user_notification_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SCHEMA CREATION COMPLETE
-- ============================================
