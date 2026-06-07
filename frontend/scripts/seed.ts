import { Pool } from 'pg';

const STRAPI_URL = 'https://emas-boutique-backend.onrender.com';
const API_TOKEN = '71fcf9f738f9618bb9893c17b6219ad55a104c81752e45697c1249f4cb286985d26caf704742ac8ec4f61c97de67b07c3fb95f5cdb1b6ecd8b7b9c6d34620c1b9b751b32a3e2cb0609419c4515c899f2cc2b1d01f9bb3b48ac17de8be7166264369c7a3a643bdf3bfc1a0f8c2c8c9f2749661720c6f36b9448651b9e675de3fb';
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL no configurada');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function fetchAPI(endpoint: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      signal: controller.signal,
    });
    const data = await res.json();
    return data.data || [];
  } finally {
    clearTimeout(timeout);
  }
}

function getImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

async function migrateBrands() {
  const brands = await fetchAPI('/brands');
  for (const b of brands) {
    const logoUrl = b.logo ? getImageUrl(b.logo.url) : null;
    await pool.query(
      `INSERT INTO brands (id, name, slug, logo_url, active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.name, b.slug || b.name.toLowerCase().replace(/\s+/g, '-'), logoUrl, b.active ?? true, b.createdAt, b.updatedAt]
    );
    console.log(`  Brand: ${b.name}`);
  }
  return brands;
}

async function migrateCategories() {
  const categories = await fetchAPI('/categories?sort=order:asc');
  for (const c of categories) {
    await pool.query(
      `INSERT INTO categories (id, name, slug, description, active, "order", created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.slug || c.name.toLowerCase(), c.description, c.active ?? true, c.order ?? 0, c.createdAt, c.updatedAt]
    );
    console.log(`  Category: ${c.name}`);
  }
  return categories;
}

async function migrateSubcategories() {
  const subcategories = await fetchAPI('/subcategories?populate=*&sort=order:asc');
  for (const s of subcategories) {
    const catId = s.category?.id || s.category || null;
    await pool.query(
      `INSERT INTO subcategories (id, name, slug, description, active, "order", category_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [s.id, s.name, s.slug || s.name.toLowerCase().replace(/\s+/g, '-'), s.description, s.active ?? true, s.order ?? 0, catId, s.createdAt, s.updatedAt]
    );
    console.log(`  Subcategory: ${s.name}`);
  }
  return subcategories;
}

async function migrateProducts() {
  const products = await fetchAPI('/products?populate=*&pagination[limit]=100');
  for (const p of products) {
    const images = (p.images || []).map((img: any) => ({
      id: img.id,
      url: getImageUrl(img.url),
      alt: img.alternativeText || '',
      width: img.width,
      height: img.height,
      formats: img.formats || null,
    }));

    const brandId = p.brand?.id || null;
    const categoryId = p.cat?.id || null;
    const subcategoryId = p.subcat?.id || null;

    await pool.query(
      `INSERT INTO products (id, name, slug, price, old_price, category, subcategory,
         category_id, subcategory_id, description, sizes, images, featured,
         brand_id, sku, availability, new_arrival, on_sale, colors, tags,
         created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       ON CONFLICT (id) DO NOTHING`,
      [p.id, p.name, p.slug, p.price, p.oldPrice || null, p.category, p.subcategory,
       categoryId, subcategoryId, p.description || '', p.sizes || [], JSON.stringify(images),
       !!p.featured, brandId, p.sku || null, p.availability || 'available',
       !!p.newArrival, !!p.onSale, p.colors || [], p.tags || [],
       p.createdAt, p.updatedAt]
    );
    console.log(`  Product: ${p.name}`);
  }
  return products;
}

async function main() {
  console.log('Migrando datos de Strapi a Supabase...\n');

  console.log('1. Marcas...');
  await migrateBrands();

  console.log('\n2. Categorias...');
  await migrateCategories();

  console.log('\n3. Subcategorias...');
  await migrateSubcategories();

  console.log('\n4. Productos...');
  await migrateProducts();

  console.log('\nMigracion completada!');
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error('Error:', err);
    pool.end();
    process.exit(1);
  });
