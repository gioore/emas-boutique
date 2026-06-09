import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne, execute } from '@/lib/db';

const ALLOWED_CONFIG_KEYS = ['site_name', 'site_description', 'whatsapp', 'email', 'instagram', 'hero_title', 'hero_subtitle'];

export async function GET() {
  try {
    await requireAuth();
    const row = await queryOne<{ key: string; value: string }>("SELECT key, value FROM site_config WHERE key = 'site_settings'");
    const settings = row ? JSON.parse(row.value) : {};
    return NextResponse.json({ data: settings });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = body.data || body;
    const filtered: Record<string, unknown> = {};
    for (const key of ALLOWED_CONFIG_KEYS) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }
    await execute(
      "INSERT INTO site_config (key, value, updated_at) VALUES ('site_settings', $1, now()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = now()",
      [JSON.stringify(filtered)]
    );
    return NextResponse.json({ data: filtered });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
