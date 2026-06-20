import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';
import { syncSequence } from '@/lib/product-utils';

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

    let slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await queryOne<{ id: number }>('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (existing) {
      const count = await queryOne<{ n: number }>('SELECT COUNT(*) as n FROM categories WHERE slug LIKE $1', [`${slug}-%`]);
      slug = `${slug}-${(count?.n ?? 0) + 1}`;
    }
    await syncSequence('categories');
    const result = await queryOne<{ id: number }>(
      'INSERT INTO categories (name, slug, description, active, "order") VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [data.name.trim(), slug, data.description || '', data.active ?? true, data.order ?? 0]
    );
    return NextResponse.json({ data: { id: result?.id, ...data, slug } }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
