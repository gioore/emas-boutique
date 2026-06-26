import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';
import { slugify, ensureUniqueSlug, syncSequence } from '@/lib/product-utils';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth();
    const rows = await query('SELECT s.*, c.name as category_name FROM subcategories s LEFT JOIN categories c ON c.id = s.category_id ORDER BY s."order"');
    return NextResponse.json({ data: rows });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = body.data || body;

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'El nombre de la subcategoría es requerido' }, { status: 400 });
    }
    if (!data.category_id) {
      return NextResponse.json({ error: 'Debes seleccionar una categoría' }, { status: 400 });
    }

    const slug = data.slug || slugify(data.name);
    const uniqueSlug = await ensureUniqueSlug(slug, 'subcategories');
    await syncSequence('subcategories');
    const result = await queryOne<{ id: number }>(
      'INSERT INTO subcategories (name, slug, description, active, "order", category_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [data.name.trim(), uniqueSlug, data.description || '', data.active ?? true, data.order ?? 0, data.category_id]
    );
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: result?.id, ...data, slug: uniqueSlug } }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
