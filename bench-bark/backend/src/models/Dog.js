import db from '../db/index.js';

const Dog = {
  async create(data) {
    const { rows } = await db.query(
      `INSERT INTO dogs (user_id, name, breed, estimated_age, weight, weight_unit, gender, photo_url, photo_public_id, vaccination_records, special_needs, medical_notes, ai_breed_confidence, ai_age_confidence, ai_raw_response)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [data.user_id, data.name, data.breed, data.estimated_age, data.weight, data.weight_unit, data.gender, data.photo_url, data.photo_public_id, JSON.stringify(data.vaccination_records || []), data.special_needs, data.medical_notes, data.ai_breed_confidence, data.ai_age_confidence, data.ai_raw_response ? JSON.stringify(data.ai_raw_response) : null]
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const { rows } = await db.query('SELECT * FROM dogs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM dogs WHERE id = $1', [id]);
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowedFields = ['name', 'breed', 'estimated_age', 'weight', 'weight_unit', 'gender', 'photo_url', 'photo_public_id', 'vaccination_records', 'special_needs', 'medical_notes', 'ai_breed_confidence', 'ai_age_confidence', 'ai_raw_response'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${idx}`);
        const val = (field === 'vaccination_records' || field === 'ai_raw_response') && data[field] !== null
          ? JSON.stringify(data[field])
          : data[field];
        values.push(val);
        idx++;
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await db.query(
      `UPDATE dogs SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM dogs WHERE id = $1', [id]);
  },

  async isOwnedBy(dogId, userId) {
    const { rows } = await db.query('SELECT id FROM dogs WHERE id = $1 AND user_id = $2', [dogId, userId]);
    return rows.length > 0;
  },
};

export default Dog;
