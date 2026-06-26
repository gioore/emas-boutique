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
    const row = await queryOne('SELECT * FROM categories WHERE id = $1', [id]);
    if (!row) return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
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
      return NextResponse.json({ error: 'El nombre de la categoría es requerido' }, { status: 400 });
    }

    const slug = data.slug || slugify(data.name);
    await execute(
      'UPDATE categories SET name=$1, slug=$2, description=$3, active=$4, "order"=$5, updated_at=now() WHERE id=$6',
      [data.name.trim(), slug, data.description || '', data.active ?? true, data.order ?? 0, id]
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
    const refs = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM products WHERE category_id = $1', [id]);
    if (refs && Number(refs.count) > 0) {
      return NextResponse.json({ error: `No se puede eliminar: ${refs.count} producto(s) usan esta categoría` }, { status: 409 });
    }
    const subcatCheck = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM subcategories WHERE category_id = $1', [id]);
    if (subcatCheck && Number(subcatCheck.count) > 0) {
      return NextResponse.json({ error: `No se puede eliminar: ${subcatCheck.count} subcategoría(s) dependen de esta categoría. Elimínalas primero.` }, { status: 409 });
    }
    await execute('DELETE FROM categories WHERE id = $1', [id]);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: null });
  } catch (err) {
    return handleApiError(err);
  }
}
