import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    await requireAuth();
    const rows = await query('SELECT * FROM brands ORDER BY name');
    return NextResponse.json({ data: rows });
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

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'El nombre de la marca es requerido' }, { status: 400 });
    }

    let slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await queryOne('SELECT id FROM brands WHERE slug = $1', [slug]);
    if (existing) {
      const count = await queryOne('SELECT COUNT(*) as n FROM brands WHERE slug LIKE $1', [`${slug}-%`]);
      slug = `${slug}-${(count?.n ?? 0) + 1}`;
    }
    const result = await queryOne(
      'INSERT INTO brands (name, slug, logo_url, active) VALUES ($1,$2,$3,$4) RETURNING id',
      [data.name.trim(), slug, data.logo_url || null, data.active ?? true]
    );
    return NextResponse.json({ data: { id: result?.id, name: data.name, slug } }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
