const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'boutique2025';

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getAuthToken(username: string): string {
  const payload = { username, exp: Date.now() + 86400000 };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyAuthToken(token: string): { valid: boolean; username?: string } {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return { valid: false };
    if (payload.username === ADMIN_USERNAME) return { valid: true, username: payload.username };
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function fetchStrapiAdmin<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return res.json();
}

export async function uploadImage(file: File): Promise<{ id: number; url: string }> {
  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error(`Error uploading image: ${res.status}`);

  const data = await res.json();
  return data[0];
}
