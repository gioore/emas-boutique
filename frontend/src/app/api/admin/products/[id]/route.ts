import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { queryOne, execute } from '@/lib/db';
import { validateProductBody, ensureUniqueSlug } from '@/lib/product-utils';
import { createHash } from 'crypto';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const row = await queryOne<{ images: unknown; price: unknown; old_price: unknown }>(`
      SELECT p.*, b.name as brand_name, c.name as cat_name, sc.name as subcat_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
      WHERE p.id = $1
    `, [id]);
    if (!row) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    let images: any[] = [];
    if (Array.isArray(row.images)) images = row.images;
    else if (typeof row.images === 'string') try { images = JSON.parse(row.images); } catch {}
    const mapped = { ...row, images, price: Number(row.price), old_price: row.old_price ? Number(row.old_price) : null };
    return NextResponse.json({ data: mapped });
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

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`)
    .digest('hex');
  try {
    await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ public_id: publicId, api_key: API_KEY, timestamp: String(timestamp), signature }),
    });
  } catch {}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;

    const row = await queryOne<{ images: unknown }>('SELECT images FROM products WHERE id = $1', [id]);
    const images = Array.isArray(row?.images) ? row.images : [];
    if (images.length > 0) {
      const publicIds = images.map((img: any) => img.public_id).filter(Boolean);
      await Promise.all(publicIds.map(deleteCloudinaryImage));
    }

    await execute('DELETE FROM products WHERE id = $1', [id]);
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: null });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
