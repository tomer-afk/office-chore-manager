import pg from 'pg';
import env from '../config/environment.js';

const { Pool } = pg;

const poolConfig = env.db.url
  ? { connectionString: env.db.url, ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.name,
      user: env.db.user,
      password: env.db.password,
    };

const pool = new Pool(poolConfig);

const db = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};

export default db;
