import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne, execute } from '@/lib/db';

async function ensureTable() {
  await query(
    `CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT now()
    )`
  );
  await execute(
    'INSERT INTO site_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
    ['site_settings', '{}']
  );
}

export async function GET() {
  try {
    await requireAuth();
    await ensureTable();
    const row = await queryOne<{ key: string; value: string }>("SELECT key, value FROM site_config WHERE key = 'site_settings'");
    const settings = row ? JSON.parse(row.value) : {};
    return NextResponse.json({ data: settings });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    await ensureTable();
    const body = await request.json();
    const data = body.data || body;
    await execute(
      "INSERT INTO site_config (key, value, updated_at) VALUES ('site_settings', $1, now()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = now()",
      [JSON.stringify(data)]
    );
    return NextResponse.json({ data });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
