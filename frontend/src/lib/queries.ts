import { query, queryOne } from './db';
import { formatProduct } from './format-product';
import type { ProductRow } from './format-product';

function formatBrand(b: any) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo_url ? { url: b.logo_url } : null,
    active: b.active ?? true,
  };
}

export async function getProduct(slug: string) {
  const p = await queryOne<ProductRow>(`
    SELECT p.*,
      c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
      sc.id as subcat_id, sc.name as subcat_name, sc.slug as subcat_slug,
      b.id as brand_id, b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    WHERE p.slug = $1
  `, [slug]);
  if (!p) throw new Error('Product not found');
  return { data: formatProduct(p)!, meta: {} };
}

export async function getFeaturedProducts() {
  const rows = await query<ProductRow>(`
    SELECT p.*,
      c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
      sc.id as subcat_id, sc.name as subcat_name, sc.slug as subcat_slug,
      b.id as brand_id, b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    WHERE p.featured = true ORDER BY p.created_at DESC LIMIT 20
  `);
  return rows.map(formatProduct).filter((p): p is NonNullable<typeof p> => p != null);
}

export async function getNewArrivals() {
  const rows = await query<ProductRow>(`
    SELECT p.*,
      c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
      sc.id as subcat_id, sc.name as subcat_name, sc.slug as subcat_slug,
      b.id as brand_id, b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    WHERE p.new_arrival = true ORDER BY p.created_at DESC LIMIT 20
  `);
  return rows.map(formatProduct).filter((p): p is NonNullable<typeof p> => p != null);
}

export async function getOnSaleProducts() {
  const rows = await query<ProductRow>(`
    SELECT p.*,
      c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
      sc.id as subcat_id, sc.name as subcat_name, sc.slug as subcat_slug,
      b.id as brand_id, b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    WHERE p.on_sale = true ORDER BY p.created_at DESC LIMIT 20
  `);
  return rows.map(formatProduct).filter((p): p is NonNullable<typeof p> => p != null);
}

export async function getBrands() {
  const rows = await query('SELECT * FROM brands ORDER BY name');
  return rows.map(formatBrand);
}
