import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { queryOne, execute } from '@/lib/db';

function validateProductBody(data: Record<string, unknown>, isUpdate = false): string | null {
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) return 'El nombre del producto es requerido';
  }
  if (data.price !== undefined && data.price !== null) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) return 'El precio debe ser un número válido mayor o igual a 0';
  }
  if (data.sizes !== undefined && (!Array.isArray(data.sizes) || data.sizes.length === 0)) return 'Debes seleccionar al menos una talla';
  if (data.availability !== undefined && !['available', 'low_stock', 'out_of_stock', 'pre_order'].includes(data.availability as string)) return 'Disponibilidad inválida';
  return null;
}

async function ensureUniqueSlug(slug: string, excludeId?: number): Promise<string> {
  let candidate = slug;
  let counter = 0;
  while (true) {
    const existing = excludeId
      ? await queryOne('SELECT id FROM products WHERE slug = $1 AND id != $2', [candidate, excludeId])
      : await queryOne('SELECT id FROM products WHERE slug = $1', [candidate]);
    if (!existing) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = body.data || body;

    const validationError = validateProductBody(data, true);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const uniqueSlug = await ensureUniqueSlug(slug, Number(id));

    await execute(`
      UPDATE products SET name=$1, slug=$2, price=$3, old_price=$4, category=$5, subcategory=$6,
        category_id=$7, subcategory_id=$8, description=$9, sizes=$10, images=$11,
        featured=$12, brand_id=$13, sku=$14, availability=$15, new_arrival=$16, on_sale=$17,
        colors=$18, tags=$19, updated_at=now()
      WHERE id=$20
    `, [
      data.name, uniqueSlug, data.price, data.oldPrice || null,
      data.category, data.subcategory, data.category_id || null, data.subcategory_id || null,
      data.description || '', data.sizes || [], JSON.stringify(data.images || []),
      !!data.featured, data.brand_id || null, data.sku || null,
      data.availability || 'available', !!data.newArrival, !!data.onSale,
      data.colors || [], data.tags || [], id,
    ]);

    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: Number(id), ...data, slug: uniqueSlug } });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    await execute('DELETE FROM products WHERE id = $1', [id]);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: null });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
