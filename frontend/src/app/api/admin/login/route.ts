import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createToken, setSessionCookie } from '@/lib/admin-auth-server';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (value.resetAt < now) attempts.delete(key);
  }
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(key: string): boolean {
  cleanupExpired();
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  return current.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  attempts.set(key, { ...current, count: current.count + 1 });
}

function clearAttempts(key: string): void {
  attempts.delete(key);
}

export async function POST(request: NextRequest) {
  try {
    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (validateCredentials(username, password)) {
      const token = createToken(username);
      await setSessionCookie(token);
      clearAttempts(clientKey);

      return NextResponse.json({ data: { username } });
    }

    recordFailedAttempt(clientKey);

    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
