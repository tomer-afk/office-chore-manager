const pool = require('../db');

class Team {
  /**
   * Create a new team
   */
  static async create({ name, description, createdBy }) {
    const query = `
      INSERT INTO teams (name, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, created_by, created_at, updated_at
    `;

    const result = await pool.query(query, [name, description, createdBy]);
    return result.rows[0];
  }

  /**
   * Find teams for a user
   */
  static async findByUserId(userId) {
    const query = `
      SELECT t.*, tm.role
      FROM teams t
      INNER JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Find team by ID
   */
  static async findById(id) {
    const query = 'SELECT * FROM teams WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Add member to team
   */
  static async addMember(teamId, userId, role = 'member') {
    const query = `
      INSERT INTO team_members (team_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (team_id, user_id) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(query, [teamId, userId, role]);
    return result.rows[0];
  }

  /**
   * Get team members
   */
  static async getMembers(teamId) {
    const query = `
      SELECT u.id, u.name, u.email, u.avatar_url, tm.role, tm.joined_at
      FROM users u
      INNER JOIN team_members tm ON u.id = tm.user_id
      WHERE tm.team_id = $1
      ORDER BY tm.joined_at ASC
    `;

    const result = await pool.query(query, [teamId]);
    return result.rows;
  }

  /**
   * Remove member from team
   */
  static async removeMember(teamId, userId) {
    const query = 'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2';
    await pool.query(query, [teamId, userId]);
  }

  /**
   * Check if user is member of team
   */
  static async isMember(teamId, userId) {
    const query = 'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2';
    const result = await pool.query(query, [teamId, userId]);
    return result.rows.length > 0;
  }

  /**
   * Update team
   */
  static async update(id, updates) {
    const allowedUpdates = ['name', 'description'];
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
      UPDATE teams
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete team
   */
  static async delete(id) {
    const query = 'DELETE FROM teams WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Team;
