import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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

    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
