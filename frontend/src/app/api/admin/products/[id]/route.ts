import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { execute } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = body.data || body;

    await execute(`
      UPDATE products SET name=$1, slug=$2, price=$3, old_price=$4, category=$5, subcategory=$6,
        category_id=$7, subcategory_id=$8, description=$9, sizes=$10, images=$11,
        featured=$12, brand_id=$13, sku=$14, availability=$15, new_arrival=$16, on_sale=$17,
        colors=$18, tags=$19, updated_at=now()
      WHERE id=$20
    `, [
      data.name, data.slug, data.price, data.oldPrice || null,
      data.category, data.subcategory, data.category_id || null, data.subcategory_id || null,
      data.description || '', data.sizes || [], JSON.stringify(data.images || []),
      !!data.featured, data.brand_id || null, data.sku || null,
      data.availability || 'available', !!data.newArrival, !!data.onSale,
      data.colors || [], data.tags || [], id,
    ]);

    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: Number(id), ...data } });
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
