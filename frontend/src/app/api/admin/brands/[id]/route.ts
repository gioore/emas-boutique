import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { execute, queryOne } from '@/lib/db';
import { slugify } from '@/lib/product-utils';
import { handleApiError } from '@/lib/api-utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const row = await queryOne('SELECT * FROM brands WHERE id = $1', [id]);
    if (!row) return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    return NextResponse.json({ data: row });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = body.data || body;

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'El nombre de la marca es requerido' }, { status: 400 });
    }

    const slug = data.slug || slugify(data.name);
    await execute(
      'UPDATE brands SET name=$1, slug=$2, logo_url=$3, active=$4, updated_at=now() WHERE id=$5',
      [data.name.trim(), slug, data.logo_url || null, data.active ?? true, id]
    );
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: Number(id), ...data, slug } });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const refs = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM products WHERE brand_id = $1', [id]);
    if (refs && Number(refs.count) > 0) {
      return NextResponse.json({ error: `No se puede eliminar: ${refs.count} producto(s) usan esta marca` }, { status: 409 });
    }
    await execute('DELETE FROM brands WHERE id = $1', [id]);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: null });
  } catch (err) {
    return handleApiError(err);
  }
}
