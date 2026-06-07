import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';

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

export async function GET() {
  try {
    await requireAuth();
    const rows = await query(`
      SELECT p.*, b.name as brand_name, c.name as cat_name, sc.name as subcat_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
      ORDER BY p.id DESC
    `);
    const mapped = rows.map((p: any) => ({
      ...p,
      price: Number(p.price),
      old_price: p.old_price ? Number(p.old_price) : null,
    }));
    return NextResponse.json({ data: mapped });
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

    const validationError = validateProductBody(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const uniqueSlug = await ensureUniqueSlug(slug);

    const result = await queryOne(`
      INSERT INTO products (name, slug, price, old_price, category, subcategory, category_id, subcategory_id,
        description, sizes, images, featured, brand_id, sku, availability, new_arrival, on_sale, colors, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id
    `, [
      data.name, uniqueSlug, data.price, data.oldPrice || null,
      data.category, data.subcategory, data.category_id || null, data.subcategory_id || null,
      data.description || '', data.sizes || [], JSON.stringify(data.images || []),
      !!data.featured, data.brand_id || null, data.sku || null,
      data.availability || 'available', !!data.newArrival, !!data.onSale,
      data.colors || [], data.tags || [],
    ]);

    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: result?.id, ...data, slug: uniqueSlug } }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
