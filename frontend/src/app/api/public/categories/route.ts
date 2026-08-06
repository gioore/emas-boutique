import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const catRows = await query('SELECT * FROM categories WHERE active = true ORDER BY "order"');
    const subRows = await query('SELECT * FROM subcategories WHERE active = true ORDER BY "order"');

    const categories = catRows.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      subcategories: subRows
        .filter((s: any) => s.category_id === cat.id)
        .map((s: any) => ({ id: s.id, name: s.name, slug: s.slug })),
    }));

    return NextResponse.json({ data: categories }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
