import db from '../db/index.js';

const Lesson = {
  async findAll({ categoryId, publishedOnly = false } = {}) {
    let query = 'SELECT l.*, c.name as category_name FROM lessons l JOIN categories c ON l.category_id = c.id';
    const conditions = [];
    const params = [];

    if (categoryId) {
      params.push(categoryId);
      conditions.push(`l.category_id = $${params.length}`);
    }
    if (publishedOnly) {
      conditions.push('l.is_published = true');
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY l.display_order, l.created_at DESC';

    const { rows } = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      'SELECT l.*, c.name as category_name FROM lessons l JOIN categories c ON l.category_id = c.id WHERE l.id = $1',
      [id]
    );
    return rows[0];
  },

  async findByCategory(categoryId, publishedOnly = true) {
    let query = 'SELECT * FROM lessons WHERE category_id = $1';
    if (publishedOnly) query += ' AND is_published = true';
    query += ' ORDER BY display_order, created_at DESC';
    const { rows } = await db.query(query, [categoryId]);
    return rows;
  },

  async create(data) {
    const { rows } = await db.query(
      `INSERT INTO lessons (category_id, title, description, content_body, video_url, video_file_url, image_urls, thumbnail_url, created_by, display_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [data.category_id, data.title, data.description, data.content_body, data.video_url, data.video_file_url, JSON.stringify(data.image_urls || []), data.thumbnail_url, data.created_by, data.display_order || 0, data.is_published || false]
    );
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;
    const allowed = ['category_id', 'title', 'description', 'content_body', 'video_url', 'video_file_url', 'image_urls', 'thumbnail_url', 'display_order', 'is_published'];

    for (const field of allowed) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${idx}`);
        values.push(field === 'image_urls' ? JSON.stringify(data[field]) : data[field]);
        idx++;
      }
    }

    if (fields.length === 0) return this.findById(id);
    fields.push('updated_at = NOW()');
    values.push(id);

    const { rows } = await db.query(
      `UPDATE lessons SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM lessons WHERE id = $1', [id]);
  },

  async markAsRead(userId, lessonId) {
    await db.query(
      `INSERT INTO user_lesson_progress (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT (user_id, lesson_id) DO NOTHING`,
      [userId, lessonId]
    );
  },

  async getUserProgress(userId) {
    const totalResult = await db.query('SELECT COUNT(*) as total FROM lessons WHERE is_published = true');
    const readResult = await db.query('SELECT COUNT(*) as read FROM user_lesson_progress WHERE user_id = $1', [userId]);
    const total = parseInt(totalResult.rows[0].total, 10);
    const read = parseInt(readResult.rows[0].read, 10);
    return { total, read, percentage: total > 0 ? Math.round((read / total) * 100) : 0 };
  },

  async getUserReadLessons(userId) {
    const { rows } = await db.query('SELECT lesson_id FROM user_lesson_progress WHERE user_id = $1', [userId]);
    return new Set(rows.map(r => r.lesson_id));
  },
};

export default Lesson;
