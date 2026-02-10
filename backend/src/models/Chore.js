const pool = require('../db');

class Chore {
  /**
   * Create a new chore
   */
  static async create({
    team_id,
    title,
    description,
    priority = 'medium',
    color = '#3B82F6',
    assigned_to,
    created_by,
    start_date,
    due_date,
    is_recurring = false,
    recurrence_pattern,
    recurrence_interval,
    recurrence_days_of_week,
    recurrence_day_of_month,
    recurrence_end_date,
    is_template = false,
    parent_chore_id = null,
  }) {
    const query = `
      INSERT INTO chores (
        team_id, title, description, priority, color, assigned_to, created_by,
        start_date, due_date, is_recurring, recurrence_pattern, recurrence_interval,
        recurrence_days_of_week, recurrence_day_of_month, recurrence_end_date,
        is_template, parent_chore_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'active')
      RETURNING *
    `;

    const values = [
      team_id,
      title,
      description,
      priority,
      color,
      assigned_to,
      created_by,
      start_date,
      due_date,
      is_recurring,
      recurrence_pattern,
      recurrence_interval,
      recurrence_days_of_week,
      recurrence_day_of_month,
      recurrence_end_date,
      is_template,
      parent_chore_id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find chores by team ID with filters
   */
  static async findByTeam(team_id, filters = {}) {
    const {
      assigned_to,
      status,
      priority,
      start_date,
      end_date,
      is_template,
    } = filters;

    let query = `
      SELECT c.*,
             u.name as assigned_to_name,
             creator.name as created_by_name
      FROM chores c
      LEFT JOIN users u ON c.assigned_to = u.id
      LEFT JOIN users creator ON c.created_by = creator.id
      WHERE c.team_id = $1
    `;

    const values = [team_id];
    let paramCount = 1;

    // Add filters
    if (assigned_to) {
      paramCount++;
      query += ` AND c.assigned_to = $${paramCount}`;
      values.push(assigned_to);
    }

    if (status) {
      paramCount++;
      query += ` AND c.status = $${paramCount}`;
      values.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND c.priority = $${paramCount}`;
      values.push(priority);
    }

    if (start_date) {
      paramCount++;
      query += ` AND c.due_date >= $${paramCount}`;
      values.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND c.due_date <= $${paramCount}`;
      values.push(end_date);
    }

    if (typeof is_template !== 'undefined') {
      paramCount++;
      query += ` AND c.is_template = $${paramCount}`;
      values.push(is_template);
    }

    query += ' ORDER BY c.due_date ASC, c.priority DESC, c.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find a chore by ID
   */
  static async findById(id) {
    const query = `
      SELECT c.*,
             u.name as assigned_to_name,
             creator.name as created_by_name
      FROM chores c
      LEFT JOIN users u ON c.assigned_to = u.id
      LEFT JOIN users creator ON c.created_by = creator.id
      WHERE c.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Update a chore
   */
  static async update(id, updates) {
    const allowedFields = [
      'title',
      'description',
      'priority',
      'color',
      'assigned_to',
      'start_date',
      'due_date',
      'status',
      'recurrence_pattern',
      'recurrence_interval',
      'recurrence_days_of_week',
      'recurrence_day_of_month',
      'recurrence_end_date',
    ];

    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE chores
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a chore
   */
  static async delete(id) {
    const query = 'DELETE FROM chores WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Mark a chore as completed
   */
  static async complete(id, user_id, notes = null) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update chore status
      const updateQuery = `
        UPDATE chores
        SET status = 'completed',
            completed_at = CURRENT_TIMESTAMP,
            completed_by = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;

      const choreResult = await client.query(updateQuery, [user_id, id]);
      const chore = choreResult.rows[0];

      if (!chore) {
        throw new Error('Chore not found');
      }

      // Record completion in history
      const historyQuery = `
        INSERT INTO chore_completions (chore_id, completed_by, completion_date, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      await client.query(historyQuery, [
        id,
        user_id,
        chore.completed_at,
        notes,
      ]);

      await client.query('COMMIT');
      return chore;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get completion history for a chore
   */
  static async getCompletionHistory(chore_id) {
    const query = `
      SELECT cc.*, u.name as completed_by_name
      FROM chore_completions cc
      LEFT JOIN users u ON cc.completed_by = u.id
      WHERE cc.chore_id = $1
      ORDER BY cc.completed_at DESC
    `;

    const result = await pool.query(query, [chore_id]);
    return result.rows;
  }

  /**
   * Get active recurring chores (templates) that need instances generated
   */
  static async getActiveRecurringChores(team_id = null) {
    let query = `
      SELECT * FROM chores
      WHERE is_recurring = true
        AND is_template = true
        AND status = 'active'
    `;

    const values = [];

    if (team_id) {
      query += ' AND team_id = $1';
      values.push(team_id);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find instances of a recurring chore
   */
  static async findInstancesByParent(parent_chore_id) {
    const query = `
      SELECT c.*,
             u.name as assigned_to_name,
             creator.name as created_by_name
      FROM chores c
      LEFT JOIN users u ON c.assigned_to = u.id
      LEFT JOIN users creator ON c.created_by = creator.id
      WHERE c.parent_chore_id = $1
      ORDER BY c.due_date DESC
    `;

    const result = await pool.query(query, [parent_chore_id]);
    return result.rows;
  }

  /**
   * Get calendar view data for a team within a date range
   */
  static async getCalendarData(team_id, start_date, end_date) {
    const query = `
      SELECT c.*,
             u.name as assigned_to_name,
             u.avatar_url as assigned_to_avatar,
             creator.name as created_by_name
      FROM chores c
      LEFT JOIN users u ON c.assigned_to = u.id
      LEFT JOIN users creator ON c.created_by = creator.id
      WHERE c.team_id = $1
        AND c.is_template = false
        AND c.due_date >= $2
        AND c.due_date <= $3
        AND c.status != 'archived'
      ORDER BY c.due_date ASC
    `;

    const result = await pool.query(query, [team_id, start_date, end_date]);
    return result.rows;
  }
}

module.exports = Chore;
