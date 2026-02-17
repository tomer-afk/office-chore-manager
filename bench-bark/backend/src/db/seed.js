import bcrypt from 'bcryptjs';
import db from './index.js';

async function seed() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 12);
    await client.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@benchbark.com', passwordHash, 'Admin', 'admin']
    );
    console.log('Admin user created (admin@benchbark.com / admin123)');

    // Seed categories
    const categories = [
      { name: 'Basic Obedience', description: 'Fundamental commands like sit, stay, come, and down.', order: 1 },
      { name: 'Leash Training', description: 'Walking on a leash without pulling, heel commands.', order: 2 },
      { name: 'House Training', description: 'Potty training, crate training, and house manners.', order: 3 },
      { name: 'Socialization', description: 'Introducing your dog to people, animals, and new environments.', order: 4 },
      { name: 'Trick Training', description: 'Fun tricks like shake, roll over, and play dead.', order: 5 },
      { name: 'Behavior Correction', description: 'Addressing barking, chewing, jumping, and aggression.', order: 6 },
    ];

    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (name, description, display_order)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [cat.name, cat.description, cat.order]
      );
    }
    console.log('6 categories seeded');

    await client.query('COMMIT');
    console.log('Seed completed.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await db.pool.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
