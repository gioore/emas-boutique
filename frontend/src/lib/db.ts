import { Pool } from 'pg';
import { logError } from './logger';

const DATABASE_URL = process.env.DATABASE_URL;

const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined,
}) : null;

pool?.on('error', (err) => {
  logError('DB Pool', err);
});

export async function query<T extends Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> {
  if (!pool) {
    logError('DB query', new Error('DATABASE_URL no está configurada'));
    throw new Error('DATABASE_URL no está configurada');
  }
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (err) {
    logError('DB query', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function queryOne<T extends Record<string, unknown>>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function execute(text: string, params?: unknown[]): Promise<void> {
  if (!pool) {
    logError('DB execute', new Error('DATABASE_URL no está configurada'));
    throw new Error('DATABASE_URL no está configurada');
  }
  const client = await pool.connect();
  try {
    await client.query(text, params);
  } catch (err) {
    logError('DB execute', err);
    throw err;
  } finally {
    client.release();
  }
}
