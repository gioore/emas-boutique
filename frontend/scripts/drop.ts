import { readFileSync } from 'fs';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function run() {
  await pool.query('DROP TABLE IF EXISTS products, subcategories, categories, brands CASCADE');
  console.log('Tablas eliminadas');
  const sql = readFileSync(new URL('./migrate.sql', import.meta.url), 'utf-8');
  await pool.query(sql);
  console.log('Tablas recreadas');
  await pool.end();
}

run().catch((err) => { console.error(err); pool.end(); process.exit(1); });
