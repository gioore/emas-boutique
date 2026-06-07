import { readFileSync } from 'fs';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL no configurada');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function migrate() {
  console.log('Creando tablas...');
  const sql = readFileSync(new URL('./migrate.sql', import.meta.url), 'utf-8');
  await pool.query(sql);
  console.log('Tablas creadas correctamente');
}

migrate()
  .then(() => pool.end())
  .catch((err) => {
    console.error('Error:', err);
    pool.end();
    process.exit(1);
  });
