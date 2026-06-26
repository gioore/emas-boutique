import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createToken, setSessionCookie } from '@/lib/admin-auth-server';
import { execute, queryOne } from '@/lib/db';
import { handleApiError } from '@/lib/api-utils';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

async function initTable(): Promise<void> {
  await execute(`CREATE TABLE IF NOT EXISTS login_attempts (
    client_key TEXT PRIMARY KEY,
    attempt_count INT NOT NULL DEFAULT 0,
    reset_at BIGINT NOT NULL
  )`);
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

async function isRateLimited(key: string): Promise<boolean> {
  await initTable();
  const now = Date.now();
  const row = await queryOne<{ attempt_count: number; reset_at: number }>(
    'SELECT attempt_count, reset_at FROM login_attempts WHERE client_key = $1', [key]
  );
  if (!row || row.reset_at < now) {
    await execute(
      'INSERT INTO login_attempts (client_key, attempt_count, reset_at) VALUES ($1, 0, $2) ON CONFLICT (client_key) DO UPDATE SET attempt_count = 0, reset_at = $2',
      [key, now + WINDOW_MS]
    );
    return false;
  }
  return row.attempt_count >= MAX_ATTEMPTS;
}

async function recordFailedAttempt(key: string): Promise<void> {
  await initTable();
  const now = Date.now();
  await execute(
    `INSERT INTO login_attempts (client_key, attempt_count, reset_at) VALUES ($1, 1, $2)
     ON CONFLICT (client_key) DO UPDATE SET attempt_count = login_attempts.attempt_count + 1`,
    [key, now + WINDOW_MS]
  );
}

async function clearAttempts(key: string): Promise<void> {
  await execute('DELETE FROM login_attempts WHERE client_key = $1', [key]);
}

export async function POST(request: NextRequest) {
  try {
    const clientKey = getClientKey(request);
    if (await isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (await validateCredentials(username, password)) {
      const token = createToken(username);
      await setSessionCookie(token);
      await clearAttempts(clientKey);

      return NextResponse.json({ data: { username } });
    }

    await recordFailedAttempt(clientKey);

    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
