-- Create notifications table for in-app notification history
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  chore_id INTEGER REFERENCES chores(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('due_soon', 'overdue', 'assigned', 'completed', 'general')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create user notification preferences table
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

-- Create notification queue table for pending browser notifications
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

-- Create indexes for notification queue
CREATE INDEX idx_notification_queue_pending ON notification_queue(sent, scheduled_for);
CREATE INDEX idx_notification_queue_user ON notification_queue(user_id);

-- Create trigger for user_notification_preferences table
CREATE TRIGGER update_user_notification_preferences_updated_at BEFORE UPDATE ON user_notification_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
