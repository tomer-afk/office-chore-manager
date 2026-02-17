import bcrypt from 'bcryptjs';
import db from '../db/index.js';

const User = {
  async create({ email, password, name }) {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, role, avatar_url, weight_unit_preference, created_at`,
      [email, passwordHash, name]
    );
    return rows[0];
  },

  async createFromGoogle({ email, name, googleId, avatarUrl }) {
    const { rows } = await db.query(
      `INSERT INTO users (email, name, google_id, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET google_id = $3, avatar_url = COALESCE(users.avatar_url, $4)
       RETURNING id, email, name, role, avatar_url, google_id, weight_unit_preference, created_at`,
      [email, name, googleId, avatarUrl]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query(
      'SELECT id, email, name, role, avatar_url, google_id, weight_unit_preference, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  async findByGoogleId(googleId) {
    const { rows } = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return rows[0];
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateWeightPreference(userId, unit) {
    const { rows } = await db.query(
      'UPDATE users SET weight_unit_preference = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name, role, avatar_url, weight_unit_preference',
      [unit, userId]
    );
    return rows[0];
  },
};

export default User;
