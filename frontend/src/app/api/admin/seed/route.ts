import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const SEED_TOKEN = process.env.ADMIN_SESSION_SECRET?.slice(0, 8);

async function seed() {
  await query('DELETE FROM products');
  await query('DELETE FROM subcategories');
  await query('DELETE FROM categories');
  await query('DELETE FROM brands');

  await query(`INSERT INTO brands (id, name, slug, active) VALUES
    (1, 'Michael Kors', 'michael-kors', true), (2, 'Tommy Hilfiger', 'tommy-hilfiger', true),
    (3, 'Coach', 'coach', true), (4, 'Nike', 'nike', true),
    (5, 'Adidas', 'adidas', true), (6, 'Guess', 'guess', true),
    (7, 'Calvin Klein', 'calvin-klein', true), (8, 'Puma', 'puma', true)
  ON CONFLICT (id) DO NOTHING`);
  await query("SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands))");

  await query(`INSERT INTO categories (id, name, slug, active, "order") VALUES
    (1, 'Mujer', 'mujer', true, 1), (2, 'Hombre', 'hombre', true, 2)
  ON CONFLICT (id) DO NOTHING`);
  await query("SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))");

  await query(`INSERT INTO subcategories (id, name, slug, category_id, active, "order") VALUES
    (1, 'Vestidos', 'vestidos', 1, true, 1), (2, 'Blusas', 'blusas', 1, true, 2),
    (3, 'Pantalones', 'pantalones', 1, true, 3), (4, 'Faldas', 'faldas', 1, true, 4),
    (5, 'Abrigos', 'abrigos', 1, true, 5), (6, 'Accesorios', 'accesorios', 1, true, 6),
    (7, 'Calzado', 'calzado', 1, true, 7), (8, 'Camisas', 'camisas', 2, true, 1),
    (9, 'Playeras', 'playeras', 2, true, 2), (10, 'Pantalones', 'pantalones-hombre', 2, true, 3),
    (11, 'Chamarras', 'chamarras', 2, true, 4), (12, 'Calzado', 'calzado-hombre', 2, true, 5),
    (13, 'Accesorios', 'accesorios-hombre', 2, true, 6)
  ON CONFLICT (id) DO NOTHING`);
  await query("SELECT setval('subcategories_id_seq', (SELECT MAX(id) FROM subcategories))");

  const products: Array<{ name: string; slug: string; price: number; oldPrice: number | null; cat: number; subcat: number; brand: number; sizes: string[]; availability: string; featured: boolean; newArrival: boolean; onSale: boolean; colors: string[] }> = [
    { name: 'Vestido Floral Primavera', slug: 'vestido-floral-primavera', price: 450, oldPrice: null, cat: 1, subcat: 1, brand: 1, sizes: ['S','M','L','XL'], availability: 'available', featured: true, newArrival: true, onSale: false, colors: ['#d4a373','#4a7c59','#1c1917'] },
    { name: 'Vestido Negro Elegancia', slug: 'vestido-negro-elegancia', price: 520, oldPrice: 650, cat: 1, subcat: 1, brand: 6, sizes: ['XS','S','M','L'], availability: 'available', featured: true, newArrival: false, onSale: true, colors: ['#1c1917'] },
    { name: 'Vestido Casual Verano', slug: 'vestido-casual-verano', price: 320, oldPrice: null, cat: 1, subcat: 1, brand: 2, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#e5e0d8','#d4a373'] },
    { name: 'Vestido Largo Noche', slug: 'vestido-largo-noche', price: 680, oldPrice: null, cat: 1, subcat: 1, brand: 7, sizes: ['S','M','L'], availability: 'low_stock', featured: true, newArrival: false, onSale: false, colors: ['#1c1917','#991b1b'] },
    { name: 'Vestido Estampado Bohemio', slug: 'vestido-estampado-bohemio', price: 380, oldPrice: null, cat: 1, subcat: 1, brand: 6, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#d4a373','#c76f4b'] },
    { name: 'Blusa Blanca Clásica', slug: 'blusa-blanca-clasica', price: 220, oldPrice: null, cat: 1, subcat: 2, brand: 2, sizes: ['S','M','L','XL','2XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#ffffff'] },
    { name: 'Blusa Seda Estampada', slug: 'blusa-seda-estampada', price: 350, oldPrice: 420, cat: 1, subcat: 2, brand: 1, sizes: ['S','M','L'], availability: 'available', featured: true, newArrival: true, onSale: true, colors: ['#d4a373','#c76f4b','#e5e0d8'] },
    { name: 'Blusa Mangas Larga', slug: 'blusa-mangas-larga', price: 260, oldPrice: null, cat: 1, subcat: 2, brand: 7, sizes: ['XS','S','M','L'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#4a7c59','#1c1917'] },
    { name: 'Pantalón Ajustado Negro', slug: 'pantalon-ajustado-negro', price: 340, oldPrice: null, cat: 1, subcat: 3, brand: 3, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#1c1917'] },
    { name: 'Pantalón Palazzo Floral', slug: 'pantalon-palazzo-floral', price: 420, oldPrice: 520, cat: 1, subcat: 3, brand: 6, sizes: ['S','M','L'], availability: 'low_stock', featured: true, newArrival: true, onSale: true, colors: ['#d4a373','#ffffff'] },
    { name: 'Falda Plisada Larga', slug: 'falda-plisada-larga', price: 290, oldPrice: null, cat: 1, subcat: 4, brand: 2, sizes: ['S','M','L'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#1c1917','#4a7c59'] },
    { name: 'Falda Corta Cuero', slug: 'falda-corta-cuero', price: 380, oldPrice: null, cat: 1, subcat: 4, brand: 7, sizes: ['XS','S','M'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#1c1917'] },
    { name: 'Bolso Tote Cuero', slug: 'bolso-tote-cuero', price: 580, oldPrice: null, cat: 1, subcat: 6, brand: 1, sizes: ['Única'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['#1c1917','#d4a373'] },
    { name: 'Collar Dorado', slug: 'collar-dorado', price: 180, oldPrice: null, cat: 1, subcat: 6, brand: 6, sizes: ['Única'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#d4a373'] },
    { name: 'Bufanda Suave', slug: 'bufanda-suave', price: 140, oldPrice: null, cat: 1, subcat: 6, brand: 2, sizes: ['Única'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#d4a373','#4a7c59','#c76f4b'] },
    { name: 'Camisa Formal Blanca', slug: 'camisa-formal-blanca', price: 320, oldPrice: null, cat: 2, subcat: 8, brand: 7, sizes: ['S','M','L','XL','2XL'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['#ffffff'] },
    { name: 'Camisa Casual Cuadros', slug: 'camisa-casual-cuadros', price: 280, oldPrice: 350, cat: 2, subcat: 8, brand: 2, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: true, colors: ['#c76f4b','#4a7c59'] },
    { name: 'Camisa Lino Natural', slug: 'camisa-lino-natural', price: 360, oldPrice: null, cat: 2, subcat: 8, brand: 1, sizes: ['M','L','XL'], availability: 'low_stock', featured: false, newArrival: true, onSale: false, colors: ['#e5e0d8'] },
    { name: 'Playera Básica Algodón', slug: 'playera-basica-algodon', price: 150, oldPrice: null, cat: 2, subcat: 9, brand: 4, sizes: ['S','M','L','XL','2XL','3XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#1c1917','#ffffff','#4a7c59'] },
    { name: 'Playera Estampada Urbana', slug: 'playera-estampada-urbana', price: 190, oldPrice: null, cat: 2, subcat: 9, brand: 8, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#1c1917'] },
    { name: 'Playera Deportiva Dry-Fit', slug: 'playera-deportiva-dry-fit', price: 210, oldPrice: null, cat: 2, subcat: 9, brand: 4, sizes: ['S','M','L','XL','2XL'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['#1c1917','#d4a373'] },
    { name: 'Jean Recto Clásico', slug: 'jean-recto-clasico', price: 380, oldPrice: null, cat: 2, subcat: 10, brand: 3, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#1c1917','#4a7c59'] },
    { name: 'Pantalón Casual Beige', slug: 'pantalon-casual-beige', price: 340, oldPrice: null, cat: 2, subcat: 10, brand: 2, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#d4a373','#e5e0d8'] },
    { name: 'Chamarra Vaquera', slug: 'chamarra-vaquera', price: 520, oldPrice: 650, cat: 2, subcat: 11, brand: 3, sizes: ['M','L','XL','2XL'], availability: 'available', featured: true, newArrival: false, onSale: true, colors: ['#4a7c59','#1c1917'] },
    { name: 'Chamarra Ligera Impermeable', slug: 'chamarra-ligera-impermeable', price: 440, oldPrice: null, cat: 2, subcat: 11, brand: 4, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#1c1917'] },
    { name: 'Reloj Clásico Acero', slug: 'reloj-clasico-acero', price: 620, oldPrice: null, cat: 2, subcat: 13, brand: 1, sizes: ['Única'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['#1c1917','#d4a373'] },
    { name: 'Cinturón Cuero', slug: 'cinturon-cuero', price: 220, oldPrice: null, cat: 2, subcat: 13, brand: 3, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['#1c1917'] },
    { name: 'Gorra Deportiva', slug: 'gorra-deportiva', price: 120, oldPrice: null, cat: 2, subcat: 13, brand: 4, sizes: ['Única'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['#1c1917','#d4a373','#4a7c59'] },
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await query(`INSERT INTO products (id, name, slug, price, old_price, category, subcategory, category_id, subcategory_id, description, sizes, images, featured, brand_id, sku, availability, new_arrival, on_sale, colors, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`, [
      i + 1, p.name, p.slug, p.price, p.oldPrice,
      p.cat === 1 ? 'mujer' : 'hombre', '',
      p.cat, p.subcat,
      `Hermoso ${p.name.toLowerCase()}, ideal para cualquier ocasión. 100% original importado.`,
      JSON.stringify(p.sizes), '[]', p.featured, p.brand,
      `SKU-${String(i + 1).padStart(3, '0')}`,
      p.availability, p.newArrival, p.onSale,
      JSON.stringify(p.colors), JSON.stringify([p.cat === 1 ? 'mujer' : 'hombre', p.slug.split('-')[0]]),
    ]);
  }
  await query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token || token !== SEED_TOKEN) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
  try {
    await seed();
    return NextResponse.json({ ok: true, message: 'Base de datos limpiada y sembrada con datos de prueba' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
