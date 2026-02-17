import db from '../db/index.js';

const Category = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY display_order, name');
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return rows[0];
  },

  async create({ name, description, image_url, display_order }) {
    const { rows } = await db.query(
      'INSERT INTO categories (name, description, image_url, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, image_url, display_order || 0]
    );
    return rows[0];
  },

  async update(id, { name, description, image_url, display_order }) {
    const { rows } = await db.query(
      `UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description), image_url = COALESCE($3, image_url), display_order = COALESCE($4, display_order), updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, description, image_url, display_order, id]
    );
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  },

  async getLessonCount(categoryId) {
    const { rows } = await db.query(
      'SELECT COUNT(*) as count FROM lessons WHERE category_id = $1 AND is_published = true',
      [categoryId]
    );
    return parseInt(rows[0].count, 10);
  },

  async findAllWithCounts() {
    const { rows } = await db.query(`
      SELECT c.*, COALESCE(lc.count, 0)::int AS lesson_count
      FROM categories c
      LEFT JOIN (
        SELECT category_id, COUNT(*) AS count FROM lessons WHERE is_published = true GROUP BY category_id
      ) lc ON c.id = lc.category_id
      ORDER BY c.display_order, c.name
    `);
    return rows;
  },
};

export default Category;
