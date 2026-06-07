import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || (IS_PRODUCTION ? '' : 'admin');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (IS_PRODUCTION ? '' : 'boutique2025');
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || (IS_PRODUCTION ? '' : 'dev-only-session-secret');
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 86400000; // 24h

function getSessionSecret(): string {
  if (!ADMIN_SESSION_SECRET) {
    throw new Error('ADMIN_SESSION_SECRET no configurado');
  }
  return ADMIN_SESSION_SECRET;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function validateCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return false;
  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);
}

export function createToken(username: string): string {
  const payload = { username, exp: Date.now() + SESSION_DURATION };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return { valid: false };
    if (!safeEqual(signature, signPayload(encodedPayload))) return { valid: false };

    const payload = JSON.parse(decodeBase64Url(encodedPayload));
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
