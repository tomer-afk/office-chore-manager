const pool = require('../db');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   */
  static async create({ email, password, name }) {
    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password_hash, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, avatar_url, created_at
    `;

    const result = await pool.query(query, [email, passwordHash, name]);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const query = 'SELECT id, email, name, avatar_url, created_at, updated_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Verify password
   */
  static async verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * Update user
   */
  static async update(id, updates) {
    const allowedUpdates = ['name', 'avatar_url'];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, avatar_url, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(id) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = User;
