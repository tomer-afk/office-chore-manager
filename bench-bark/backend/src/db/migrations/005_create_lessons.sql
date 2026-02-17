CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_body TEXT,
  video_url TEXT,
  video_file_url TEXT,
  image_urls JSONB DEFAULT '[]',
  thumbnail_url TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_category_id ON lessons(category_id);
CREATE INDEX idx_lessons_published ON lessons(is_published);
