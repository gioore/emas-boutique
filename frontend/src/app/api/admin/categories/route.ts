import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    await requireAuth();
    const rows = await query('SELECT * FROM categories ORDER BY "order"');
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
      return NextResponse.json({ error: 'El nombre de la categoría es requerido' }, { status: 400 });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await queryOne(
      'INSERT INTO categories (name, slug, description, active, "order") VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [data.name.trim(), slug, data.description || '', data.active ?? true, data.order ?? 0]
    );
    return NextResponse.json({ data: { id: result?.id, ...data, slug } }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
