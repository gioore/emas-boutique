import { query, queryOne } from './db';
import { formatProduct } from './format-product';

interface ProductRow {
  id: number; name: string; slug: string; price: number; old_price: number | null;
  category: string | null; subcategory: string | null;
  category_id: number | null; subcategory_id: number | null;
  brand_id: number | null; brand_name: string | null; brand_slug: string | null;
  description: string | null; sizes: string[] | null; images: any;
  featured: boolean; sku: string | null;
  availability: string | null; new_arrival: boolean; on_sale: boolean;
  colors: string[] | null; tags: string[] | null;
  created_at: string; updated_at: string;
}

function formatBrand(b: any) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo_url ? { url: b.logo_url } : null,
    active: b.active ?? true,
  };
}

function formatCategory(c: any) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    active: c.active ?? true,
    order: c.order || 0,
  };
}

function formatSubcategory(s: any) {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description || '',
    active: s.active ?? true,
    order: s.order || 0,
    category: s.category_id ? { id: s.category_id, name: s.category_name } : null,
  };
}

function getWhereClause(conditions: string[], params: any[]) {
  if (conditions.length === 0) return { clause: '', params };
  return { clause: 'WHERE ' + conditions.join(' AND '), params };
}

export async function getProducts(params?: Record<string, string>) {
  let conditions: string[] = [];
  let values: any[] = [];
  let idx = 1;

  if (params?.category) { conditions.push(`category = $${idx++}`); values.push(params.category); }

  const sort = 'ORDER BY id ASC';
  const w = getWhereClause(conditions, values);

  const rows = await query<ProductRow>(`SELECT * FROM products ${w.clause} ${sort}`, w.params);
  return { data: rows.map(formatProduct) };
}

export async function getProduct(slug: string) {
  const p = await queryOne<ProductRow>('SELECT * FROM products WHERE slug = $1', [slug]);
  if (!p) throw new Error('Product not found');
  return { data: formatProduct(p), meta: {} };
}

export async function getFeaturedProducts() {
  const rows = await query<ProductRow>('SELECT p.*, b.name as brand_name, b.slug as brand_slug FROM products p LEFT JOIN brands b ON b.id = p.brand_id WHERE p.featured = true ORDER BY p.created_at DESC LIMIT 20');
  return rows.map(formatProduct);
}

export async function getNewArrivals() {
  const rows = await query<ProductRow>('SELECT p.*, b.name as brand_name, b.slug as brand_slug FROM products p LEFT JOIN brands b ON b.id = p.brand_id WHERE p.new_arrival = true ORDER BY p.created_at DESC LIMIT 20');
  return rows.map(formatProduct);
}

export async function getOnSaleProducts() {
  const rows = await query<ProductRow>('SELECT p.*, b.name as brand_name, b.slug as brand_slug FROM products p LEFT JOIN brands b ON b.id = p.brand_id WHERE p.on_sale = true ORDER BY p.created_at DESC LIMIT 20');
  return rows.map(formatProduct);
}

export async function getProductsByCategory(category: string) {
  const rows = await query<ProductRow>('SELECT * FROM products WHERE category = $1', [category]);
  return rows.map(formatProduct);
}

export async function getBrands() {
  const rows = await query('SELECT * FROM brands ORDER BY name');
  return rows.map(formatBrand);
}

export async function getBrand(slug: string) {
  const row = await queryOne<any>('SELECT * FROM brands WHERE slug = $1', [slug]);
  return row ? formatBrand(row) : null;
}

export async function getProductsByBrand(brandId: number) {
  const rows = await query<ProductRow>('SELECT * FROM products WHERE brand_id = $1', [brandId]);
  return rows.map(formatProduct);
}

export async function getCategories() {
  const rows = await query('SELECT * FROM categories ORDER BY "order"');
  return rows.map(formatCategory);
}

export async function getSubcategories() {
  const rows = await query(
    `SELECT s.*, c.name as category_name FROM subcategories s
     LEFT JOIN categories c ON c.id = s.category_id
     ORDER BY s."order"`
  );
  return rows.map(formatSubcategory);
}

export async function getSubcategoriesByCategory(categoryId: number) {
  const rows = await query(
    `SELECT s.*, c.name as category_name FROM subcategories s
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.category_id = $1 ORDER BY s."order"`,
    [categoryId]
  );
  return rows.map(formatSubcategory);
}
