CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  estimated_age VARCHAR(100),
  weight DECIMAL(6,2),
  weight_unit VARCHAR(10) DEFAULT 'lbs' CHECK (weight_unit IN ('lbs', 'kg')),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unknown')),
  photo_url TEXT,
  photo_public_id VARCHAR(255),
  vaccination_records JSONB DEFAULT '[]',
  special_needs TEXT,
  medical_notes TEXT,
  ai_breed_confidence DECIMAL(5,2),
  ai_age_confidence DECIMAL(5,2),
  ai_raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dogs_user_id ON dogs(user_id);
