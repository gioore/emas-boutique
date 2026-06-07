import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    await requireAuth();
    const rows = await query('SELECT * FROM products ORDER BY id DESC');
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

    const result = await queryOne(`
      INSERT INTO products (name, slug, price, old_price, category, subcategory, category_id, subcategory_id,
        description, sizes, images, featured, brand_id, sku, availability, new_arrival, on_sale, colors, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id
    `, [
      data.name, data.slug, data.price, data.oldPrice || null,
      data.category, data.subcategory, data.category_id || null, data.subcategory_id || null,
      data.description || '', data.sizes || [], JSON.stringify(data.images || []),
      !!data.featured, data.brand_id || null, data.sku || null,
      data.availability || 'available', !!data.newArrival, !!data.onSale,
      data.colors || [], data.tags || [],
    ]);

    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: result?.id, ...data } }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
