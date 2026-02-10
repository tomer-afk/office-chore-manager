const fs = require('fs').promises;
const path = require('path');
const pool = require('./index');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Create migrations tracking table
async function createMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);
}

// Get list of executed migrations
async function getExecutedMigrations() {
  const result = await pool.query('SELECT name FROM schema_migrations ORDER BY name');
  return result.rows.map(row => row.name);
}

// Mark migration as executed
async function markMigrationExecuted(name) {
  await pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
}

// Remove migration from tracking
async function unmarkMigration(name) {
  await pool.query('DELETE FROM schema_migrations WHERE name = $1', [name]);
}

// Get all migration files
async function getMigrationFiles() {
  const files = await fs.readdir(MIGRATIONS_DIR);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort();
}

// Run migrations
async function migrateUp() {
  try {
    await createMigrationsTable();
    const executed = await getExecutedMigrations();
    const files = await getMigrationFiles();

    const pending = files.filter(file => !executed.includes(file));

    if (pending.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Running ${pending.length} migration(s)...`);

    for (const file of pending) {
      console.log(`Executing: ${file}`);
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = await fs.readFile(filePath, 'utf-8');

      await pool.query(sql);
      await markMigrationExecuted(file);

      console.log(`✓ ${file} completed`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Rollback last migration
async function migrateDown() {
  try {
    await createMigrationsTable();
    const executed = await getExecutedMigrations();

    if (executed.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    const lastMigration = executed[executed.length - 1];
    console.log(`Rolling back: ${lastMigration}`);

    // For simplicity, we'll need manual rollback SQL files
    // In production, consider using a migration tool like node-pg-migrate
    console.warn('Rollback not implemented. Please manually revert the migration.');

    // await unmarkMigration(lastMigration);
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}

// CLI interface
const command = process.argv[2];

(async () => {
  try {
    if (command === 'up') {
      await migrateUp();
    } else if (command === 'down') {
      await migrateDown();
    } else {
      console.log('Usage: node migrate.js [up|down]');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
