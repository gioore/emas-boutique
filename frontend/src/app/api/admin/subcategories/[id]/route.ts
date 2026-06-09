import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { execute, queryOne } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const row = await queryOne('SELECT s.*, c.name as category_name FROM subcategories s LEFT JOIN categories c ON c.id = s.category_id WHERE s.id = $1', [id]);
    if (!row) return NextResponse.json({ error: 'Subcategoría no encontrada' }, { status: 404 });
    return NextResponse.json({ data: row });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = body.data || body;

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'El nombre de la subcategoría es requerido' }, { status: 400 });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await execute(
      'UPDATE subcategories SET name=$1, slug=$2, description=$3, active=$4, "order"=$5, category_id=$6, updated_at=now() WHERE id=$7',
      [data.name.trim(), slug, data.description || '', data.active ?? true, data.order ?? 0, data.category_id || null, id]
    );
    return NextResponse.json({ data: { id: Number(id), ...data, slug } });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const refs = await queryOne('SELECT COUNT(*) as count FROM products WHERE subcategory_id = $1', [id]);
    if (refs && Number(refs.count) > 0) {
      return NextResponse.json({ error: `No se puede eliminar: ${refs.count} producto(s) usan esta subcategoría` }, { status: 409 });
    }
    await execute('DELETE FROM subcategories WHERE id = $1', [id]);
    return NextResponse.json({ data: null });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
