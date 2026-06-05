import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'boutique2025';
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 86400000; // 24h

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createToken(username: string): string {
  const payload = { username, exp: Date.now() + SESSION_DURATION };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return { valid: false };
    if (payload.username === ADMIN_USERNAME) return { valid: true, username: payload.username };
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 86400,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getSession(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return { authenticated: false };
  const result = verifyToken(token);
  if (!result.valid) return { authenticated: false };
  return { authenticated: true, username: result.username };
}

export async function requireAuth(): Promise<{ authenticated: true; username: string }> {
  const session = await getSession();
  if (!session.authenticated) {
    throw new Error('No autorizado');
  }
  return session as { authenticated: true; username: string };
}
