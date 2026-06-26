import { cookies } from 'next/headers';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { execute, queryOne } from '@/lib/db';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ENV_USERNAME = process.env.ADMIN_USERNAME;
const ENV_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || (IS_PRODUCTION ? '' : randomBytes(32).toString('base64'));
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 86400000;

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

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64).toString('hex');
  if (derived.length !== hash.length) return false;
  return timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}

async function initAdminTable(): Promise<void> {
  await execute(`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  )`);
}

async function getAdminUser(username: string): Promise<{ id: number; username: string; password_hash: string } | null> {
  return queryOne<{ id: number; username: string; password_hash: string }>(
    'SELECT id, username, password_hash FROM admin_users WHERE username = $1', [username]
  );
}

async function createAdminUser(username: string, password: string): Promise<void> {
  await initAdminTable();
  const hash = hashPassword(password);
  await execute(
    'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = $2, updated_at = now()',
    [username, hash]
  );
}

export async function changeAdminPassword(username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const user = await getAdminUser(username);
  if (!user) return { success: false, error: 'Usuario no encontrado' };
  if (!verifyPassword(currentPassword, user.password_hash)) return { success: false, error: 'Contraseña actual incorrecta' };
  const hash = hashPassword(newPassword);
  await execute('UPDATE admin_users SET password_hash = $1, updated_at = now() WHERE id = $2', [hash, user.id]);
  return { success: true };
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  await initAdminTable();
  const user = await getAdminUser(username);
  if (user) return verifyPassword(password, user.password_hash);
  if (ENV_USERNAME && ENV_PASSWORD && safeEqual(username, ENV_USERNAME) && safeEqual(password, ENV_PASSWORD)) {
    await createAdminUser(username, password);
    return true;
  }
  return false;
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
    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: IS_PRODUCTION,
    path: '/',
    maxAge: 86400,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: IS_PRODUCTION,
    path: '/',
    maxAge: 0,
  });
}

export async function getSession(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return { authenticated: false };
  const result = verifyToken(token);
  if (!result.valid || !result.username) return { authenticated: false };
  const user = await getAdminUser(result.username);
  if (!user) {
    const adminUsername = ENV_USERNAME;
    if (!adminUsername || result.username !== adminUsername) return { authenticated: false };
  }
  return { authenticated: true, username: result.username };
}

export async function requireAuth(): Promise<{ authenticated: true; username: string }> {
  const session = await getSession();
  if (!session.authenticated) {
    throw new Error('No autorizado');
  }
  return session as { authenticated: true; username: string };
}
