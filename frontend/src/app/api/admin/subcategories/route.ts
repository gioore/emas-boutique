import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    await requireAuth();
    const rows = await query('SELECT s.*, c.name as category_name FROM subcategories s LEFT JOIN categories c ON c.id = s.category_id ORDER BY s."order"');
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
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    const result = await queryOne(
      'INSERT INTO subcategories (name, slug, description, active, "order", category_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [data.name, slug, data.description || '', data.active ?? true, data.order ?? 0, data.category_id || null]
    );
    return NextResponse.json({ data: { id: result?.id, ...data, slug } }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
