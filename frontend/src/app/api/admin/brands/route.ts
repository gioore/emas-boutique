import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/admin-auth-server';
import { query, queryOne } from '@/lib/db';
import { slugify, ensureUniqueSlug, syncSequence } from '@/lib/product-utils';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth();
    const rows = await query('SELECT * FROM brands ORDER BY name');
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
      return NextResponse.json({ error: 'El nombre de la marca es requerido' }, { status: 400 });
    }

    const slug = data.slug || slugify(data.name);
    const uniqueSlug = await ensureUniqueSlug(slug, 'brands');
    await syncSequence('brands');
    const result = await queryOne<{ id: number }>(
      'INSERT INTO brands (name, slug, logo_url, active) VALUES ($1,$2,$3,$4) RETURNING id',
      [data.name.trim(), uniqueSlug, data.logo_url || null, data.active ?? true]
    );
    revalidateTag('catalog', 'max');
    return NextResponse.json({ data: { id: result?.id, name: data.name, slug: uniqueSlug } }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
