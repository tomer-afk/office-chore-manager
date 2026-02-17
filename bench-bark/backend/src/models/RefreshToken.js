import db from '../db/index.js';
import { hashToken } from '../middleware/auth.js';

const RefreshToken = {
  async create(userId, token, expiresAt) {
    const tokenHash = hashToken(token);
    const { rows } = await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id',
      [userId, tokenHash, expiresAt]
    );
    return rows[0];
  },

  async findByHash(token) {
    const tokenHash = hashToken(token);
    const { rows } = await db.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()',
      [tokenHash]
    );
    return rows[0];
  },

  async revoke(id) {
    await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1', [id]);
  },

  async revokeAllForUser(userId) {
    await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL', [userId]);
  },
};

export default RefreshToken;
