import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const envRaw = readFileSync('.env.local', 'utf-8');
const envVars = Object.fromEntries(
  envRaw.split('\n').filter(l => l.includes('=')).map(l => {
    const idx = l.indexOf('=');
    return [l.slice(0, idx), l.slice(idx + 1)];
  })
);

const DATABASE_URL = envVars.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not found'); process.exit(1); }

const { Pool } = await import('pg');
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// 1. Clean all data
console.log('🧹 Cleaning database...');
await query('DELETE FROM products');
await query('DELETE FROM subcategories');
await query('DELETE FROM categories');
await query('DELETE FROM brands');
await query('DELETE FROM site_config');
console.log('✅ Database cleaned');

// 2. Insert brands
console.log('📦 Inserting brands...');
await query(`INSERT INTO brands (id, name, slug, active) VALUES
  (1, 'Michael Kors', 'michael-kors', true),
  (2, 'Tommy Hilfiger', 'tommy-hilfiger', true),
  (3, 'Coach', 'coach', true),
  (4, 'Nike', 'nike', true),
  (5, 'Adidas', 'adidas', true),
  (6, 'Guess', 'guess', true),
  (7, 'Calvin Klein', 'calvin-klein', true),
  (8, 'Puma', 'puma', true)
ON CONFLICT (id) DO NOTHING`);

// Reset sequence
await query("SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands))");

// 3. Insert categories
console.log('📁 Inserting categories...');
await query(`INSERT INTO categories (id, name, slug, active, "order") VALUES
  (1, 'Mujer', 'mujer', true, 1),
  (2, 'Hombre', 'hombre', true, 2)
ON CONFLICT (id) DO NOTHING`);
await query("SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))");

// 4. Insert subcategories
console.log('📂 Inserting subcategories...');
await query(`INSERT INTO subcategories (id, name, slug, category_id, active, "order") VALUES
  (1, 'Vestidos', 'vestidos', 1, true, 1),
  (2, 'Blusas', 'blusas', 1, true, 2),
  (3, 'Pantalones', 'pantalones', 1, true, 3),
  (4, 'Faldas', 'faldas', 1, true, 4),
  (5, 'Abrigos', 'abrigos', 1, true, 5),
  (6, 'Accesorios', 'accesorios', 1, true, 6),
  (7, 'Calzado', 'calzado', 1, true, 7),
  (8, 'Camisas', 'camisas', 2, true, 1),
  (9, 'Playeras', 'playeras', 2, true, 2),
  (10, 'Pantalones', 'pantalones-hombre', 2, true, 3),
  (11, 'Chamarras', 'chamarras', 2, true, 4),
  (12, 'Calzado', 'calzado-hombre', 2, true, 5),
  (13, 'Accesorios', 'accesorios-hombre', 2, true, 6)
ON CONFLICT (id) DO NOTHING`);
await query("SELECT setval('subcategories_id_seq', (SELECT MAX(id) FROM subcategories))");

// 5. Insert sample products
console.log('👗 Inserting sample products...');
const products = [
  // Mujer - Vestidos
  { name: 'Vestido Floral Primavera', slug: 'vestido-floral-primavera', price: 450, oldPrice: null, cat: 1, subcat: 1, brand: 1, sizes: ['S','M','L','XL'], availability: 'available', featured: true, newArrival: true, onSale: false, colors: ['Dorado','Verde','Negro'] },
  { name: 'Vestido Negro Elegancia', slug: 'vestido-negro-elegancia', price: 520, oldPrice: 650, cat: 1, subcat: 1, brand: 6, sizes: ['XS','S','M','L'], availability: 'available', featured: true, newArrival: false, onSale: true, colors: ['Negro'] },
  { name: 'Vestido Casual Verano', slug: 'vestido-casual-verano', price: 320, oldPrice: null, cat: 1, subcat: 1, brand: 2, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Beige','Dorado'] },
  { name: 'Vestido Largo Noche', slug: 'vestido-largo-noche', price: 680, oldPrice: null, cat: 1, subcat: 1, brand: 7, sizes: ['S','M','L'], availability: 'low_stock', featured: true, newArrival: false, onSale: false, colors: ['Negro','Vino'] },
  { name: 'Vestido Estampado Bohemio', slug: 'vestido-estampado-bohemio', price: 380, oldPrice: null, cat: 1, subcat: 1, brand: 6, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Dorado','Terracota'] },
  
  // Mujer - Blusas
  { name: 'Blusa Blanca Clásica', slug: 'blusa-blanca-clasica', price: 220, oldPrice: null, cat: 1, subcat: 2, brand: 2, sizes: ['S','M','L','XL','2XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Blanco'] },
  { name: 'Blusa Seda Estampada', slug: 'blusa-seda-estampada', price: 350, oldPrice: 420, cat: 1, subcat: 2, brand: 1, sizes: ['S','M','L'], availability: 'available', featured: true, newArrival: true, onSale: true, colors: ['Dorado','Terracota','Beige'] },
  { name: 'Blusa Mangas Larga', slug: 'blusa-mangas-larga', price: 260, oldPrice: null, cat: 1, subcat: 2, brand: 7, sizes: ['XS','S','M','L'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Verde','Negro'] },

  // Mujer - Pantalones
  { name: 'Pantalón Ajustado Negro', slug: 'pantalon-ajustado-negro', price: 340, oldPrice: null, cat: 1, subcat: 3, brand: 3, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Negro'] },
  { name: 'Pantalón Palazzo Floral', slug: 'pantalon-palazzo-floral', price: 420, oldPrice: 520, cat: 1, subcat: 3, brand: 6, sizes: ['S','M','L'], availability: 'low_stock', featured: true, newArrival: true, onSale: true, colors: ['Dorado','Blanco'] },

  // Mujer - Faldas
  { name: 'Falda Plisada Larga', slug: 'falda-plisada-larga', price: 290, oldPrice: null, cat: 1, subcat: 4, brand: 2, sizes: ['S','M','L'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Negro','Verde'] },
  { name: 'Falda Corta Cuero', slug: 'falda-corta-cuero', price: 380, oldPrice: null, cat: 1, subcat: 4, brand: 7, sizes: ['XS','S','M'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Negro'] },

  // Mujer - Accesorios
  { name: 'Bolso Tote Cuero', slug: 'bolso-tote-cuero', price: 580, oldPrice: null, cat: 1, subcat: 6, brand: 1, sizes: ['Única'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['Negro','Dorado'] },
  { name: 'Collar Dorado', slug: 'collar-dorado', price: 180, oldPrice: null, cat: 1, subcat: 6, brand: 6, sizes: ['Única'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Dorado'] },
  { name: 'Bufanda Suave', slug: 'bufanda-suave', price: 140, oldPrice: null, cat: 1, subcat: 6, brand: 2, sizes: ['Única'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Dorado','Verde','Terracota'] },

  // Hombre - Camisas
  { name: 'Camisa Formal Blanca', slug: 'camisa-formal-blanca', price: 320, oldPrice: null, cat: 2, subcat: 8, brand: 7, sizes: ['S','M','L','XL','2XL'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['Blanco'] },
  { name: 'Camisa Casual Cuadros', slug: 'camisa-casual-cuadros', price: 280, oldPrice: 350, cat: 2, subcat: 8, brand: 2, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: true, colors: ['Terracota','Verde'] },
  { name: 'Camisa Lino Natural', slug: 'camisa-lino-natural', price: 360, oldPrice: null, cat: 2, subcat: 8, brand: 1, sizes: ['M','L','XL'], availability: 'low_stock', featured: false, newArrival: true, onSale: false, colors: ['Beige'] },

  // Hombre - Playeras
  { name: 'Playera Básica Algodón', slug: 'playera-basica-algodon', price: 150, oldPrice: null, cat: 2, subcat: 9, brand: 4, sizes: ['S','M','L','XL','2XL','3XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Negro','Blanco','Verde'] },
  { name: 'Playera Estampada Urbana', slug: 'playera-estampada-urbana', price: 190, oldPrice: null, cat: 2, subcat: 9, brand: 8, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Negro'] },
  { name: 'Playera Deportiva Dry-Fit', slug: 'playera-deportiva-dry-fit', price: 210, oldPrice: null, cat: 2, subcat: 9, brand: 4, sizes: ['S','M','L','XL','2XL'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['Negro','Dorado'] },

  // Hombre - Pantalones
  { name: 'Jean Recto Clásico', slug: 'jean-recto-clasico', price: 380, oldPrice: null, cat: 2, subcat: 10, brand: 3, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Negro','Verde'] },
  { name: 'Pantalón Casual Beige', slug: 'pantalon-casual-beige', price: 340, oldPrice: null, cat: 2, subcat: 10, brand: 2, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Dorado','Beige'] },

  // Hombre - Chamarras
  { name: 'Chamarra Vaquera', slug: 'chamarra-vaquera', price: 520, oldPrice: 650, cat: 2, subcat: 11, brand: 3, sizes: ['M','L','XL','2XL'], availability: 'available', featured: true, newArrival: false, onSale: true, colors: ['Verde','Negro'] },
  { name: 'Chamarra Ligera Impermeable', slug: 'chamarra-ligera-impermeable', price: 440, oldPrice: null, cat: 2, subcat: 11, brand: 4, sizes: ['S','M','L','XL'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Negro'] },

  // Hombre - Accesorios
  { name: 'Reloj Clásico Acero', slug: 'reloj-clasico-acero', price: 620, oldPrice: null, cat: 2, subcat: 13, brand: 1, sizes: ['Única'], availability: 'available', featured: true, newArrival: false, onSale: false, colors: ['Negro','Dorado'] },
  { name: 'Cinturón Cuero', slug: 'cinturon-cuero', price: 220, oldPrice: null, cat: 2, subcat: 13, brand: 3, sizes: ['M','L','XL'], availability: 'available', featured: false, newArrival: false, onSale: false, colors: ['Negro'] },
  { name: 'Gorra Deportiva', slug: 'gorra-deportiva', price: 120, oldPrice: null, cat: 2, subcat: 13, brand: 4, sizes: ['Única'], availability: 'available', featured: false, newArrival: true, onSale: false, colors: ['Negro','Dorado','Verde'] },
];

for (let i = 0; i < products.length; i++) {
  const p = products[i];
  const id = i + 1;
  const images = JSON.stringify([]);
  const sizes = JSON.stringify(p.sizes);
  const colors = JSON.stringify(p.colors);
  const tags = JSON.stringify([p.cat === 1 ? 'mujer' : 'hombre', p.slug.split('-')[0]]);
  
  await query(`INSERT INTO products (id, name, slug, price, old_price, category, subcategory, category_id, subcategory_id, description, sizes, images, featured, brand_id, sku, availability, new_arrival, on_sale, colors, tags)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`, [
    id, p.name, p.slug, p.price, p.oldPrice,
    p.cat === 1 ? 'mujer' : 'hombre',
    p.subcat === 10 ? 'pantalones' : p.subcat === 13 ? 'accesorios' : p.subcat === 11 ? 'chamarras' : '',
    p.cat, p.subcat,
    `Hermoso ${p.name.toLowerCase()}, ideal para cualquier ocasión. 100% original importado.`,
    sizes, images, p.featured, p.brand, `SKU-${String(id).padStart(3, '0')}`,
    p.availability, p.newArrival, p.onSale, colors, tags,
  ]);
}
await query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))");
console.log(`✅ ${products.length} products inserted`);

// 6. Insert site config
console.log('⚙️ Inserting site config...');
const siteSettings = JSON.stringify({
  site_name: 'EMAS Boutique',
  site_description: 'Boutique de moda en Guatemala — ropa, accesorios y calzado importado',
  whatsapp: '50247633183',
  email: 'info@emasboutique.com',
  instagram: 'emasboutique',
  hero_title: 'Elegancia que Inspira',
  hero_subtitle: 'Descubre las últimas tendencias en moda femenina y masculina',
});
await query(`INSERT INTO site_config (key, value, updated_at) VALUES ('site_settings', $1, now()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = now()`, [siteSettings]);
console.log('✅ Site config inserted');

await pool.end();
console.log('🎉 Seed complete!');
