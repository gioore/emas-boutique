import type { Brand, Category, Product, Subcategory } from '@/types/product';
import { query } from './db';
import { formatProduct } from './format-product';
import type { ProductRow } from './format-product';

export type CatalogSection = 'all' | 'mujer' | 'hombre';
export type CategoryWithSubcategories = Category & { subcategories?: Subcategory[] };

function formatBrand(b: any): Brand {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo_url ? { url: b.logo_url } : null,
    active: b.active ?? true,
  };
}

function formatCategory(c: any): CategoryWithSubcategories {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    active: c.active ?? true,
    order: c.order || 0,
    subcategories: (c.subcategories || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      active: s.active ?? true,
      order: s.order || 0,
    })),
  };
}

async function getProducts(section: CatalogSection): Promise<Product[]> {
  const where = section !== 'all' ? 'WHERE c.slug = $1' : '';
  const params = section !== 'all' ? [section] : [];

  const rows = await query<ProductRow>(`
    SELECT p.*,
      c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
      sc.id as subcat_id, sc.name as subcat_name, sc.slug as subcat_slug,
      b.id as brand_id, b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
    LEFT JOIN brands b ON b.id = p.brand_id
    ${where}
    ORDER BY p.created_at DESC
  `, params);

  return rows.map(formatProduct).filter((p): p is NonNullable<typeof p> => p != null);
}

async function getBrands(): Promise<Brand[]> {
  const rows = await query('SELECT * FROM brands WHERE active = true ORDER BY name');
  return rows.map(formatBrand);
}

async function getCategories(): Promise<CategoryWithSubcategories[]> {
  const catRows = await query('SELECT * FROM categories ORDER BY "order"');
  const subRows = await query('SELECT * FROM subcategories ORDER BY "order"');

  return catRows.map((cat: any) => ({
    ...formatCategory(cat),
    subcategories: subRows
      .filter((s: any) => s.category_id === cat.id)
      .map((s: any) => ({ id: s.id, name: s.name, slug: s.slug, active: s.active ?? true, order: s.order || 0 })),
  }));
}

interface CatalogResult {
  products: Product[];
  brands: Brand[];
  categories: CategoryWithSubcategories[];
  error?: string;
}

export async function getCatalogData(section: CatalogSection = 'all'): Promise<CatalogResult> {
  const [productsResult, brandsResult, categoriesResult] = await Promise.allSettled([
    getProducts(section),
    getBrands(),
    getCategories(),
  ]);

  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
  const brands = brandsResult.status === 'fulfilled' ? brandsResult.value : [];
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const hasError = [productsResult, brandsResult, categoriesResult].some((result) => result.status === 'rejected');

  return {
    products,
    brands,
    categories,
    ...(hasError ? { error: 'No pudimos cargar todo el catalogo. Intenta actualizar la pagina.' } : {}),
  };
}
