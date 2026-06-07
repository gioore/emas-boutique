import type { Brand, Category, Product, Subcategory } from '@/types/product';

const API_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const CATALOG_REVALIDATE_SECONDS = 60;

export type CatalogSection = 'all' | 'mujer' | 'hombre';
export type CategoryWithSubcategories = Category & { subcategories?: Subcategory[] };

export interface CatalogData {
  products: Product[];
  brands: Brand[];
  categories: CategoryWithSubcategories[];
  error?: string;
}

interface StrapiListResponse<T> {
  data?: T[];
}

const productFields = [
  'name',
  'slug',
  'price',
  'oldPrice',
  'category',
  'subcategory',
  'description',
  'sizes',
  'featured',
  'availability',
  'newArrival',
  'onSale',
  'colors',
  'tags',
  'createdAt',
  'publishedAt',
];

function addFields(query: URLSearchParams, fields: string[]): void {
  fields.forEach((field, index) => query.set(`fields[${index}]`, field));
}

async function fetchStrapi<T>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  };

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    headers,
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ['catalog'] },
  });

  if (!res.ok) {
    throw new Error(`Catalog API error: ${res.status}`);
  }

  return res.json();
}

function buildProductQuery(section: CatalogSection): string {
  const query = new URLSearchParams();

  addFields(query, productFields);
  query.set('populate[images][fields][0]', 'url');
  query.set('populate[images][fields][1]', 'formats');
  query.set('populate[images][fields][2]', 'alternativeText');
  query.set('populate[brand][fields][0]', 'name');
  query.set('populate[brand][fields][1]', 'slug');
  query.set('populate[brand][fields][2]', 'active');
  query.set('populate[cat][fields][0]', 'name');
  query.set('populate[cat][fields][1]', 'slug');
  query.set('populate[cat][fields][2]', 'active');
  query.set('populate[subcat][fields][0]', 'name');
  query.set('populate[subcat][fields][1]', 'slug');
  query.set('populate[subcat][fields][2]', 'active');
  query.set('sort[0]', 'createdAt:desc');
  query.set('pagination[pageSize]', '100');

  if (section !== 'all') {
    query.set('filters[category][$eq]', section);
  }

  return `/products?${query.toString()}`;
}

async function getProducts(section: CatalogSection): Promise<Product[]> {
  const response = await fetchStrapi<StrapiListResponse<Product>>(buildProductQuery(section));
  return response.data || [];
}

async function getBrands(): Promise<Brand[]> {
  const query = new URLSearchParams();
  addFields(query, ['name', 'slug', 'active']);
  query.set('sort[0]', 'name:asc');
  query.set('pagination[pageSize]', '100');

  const response = await fetchStrapi<StrapiListResponse<Brand>>(`/brands?${query.toString()}`);
  return response.data || [];
}

async function getCategories(): Promise<CategoryWithSubcategories[]> {
  const query = new URLSearchParams();
  addFields(query, ['name', 'slug', 'description', 'active', 'order']);
  query.set('populate[subcategories][fields][0]', 'name');
  query.set('populate[subcategories][fields][1]', 'slug');
  query.set('populate[subcategories][fields][2]', 'active');
  query.set('populate[subcategories][fields][3]', 'order');
  query.set('sort[0]', 'order:asc');
  query.set('pagination[pageSize]', '100');

  const response = await fetchStrapi<StrapiListResponse<CategoryWithSubcategories>>(`/categories?${query.toString()}`);
  return response.data || [];
}

export async function getCatalogData(section: CatalogSection = 'all'): Promise<CatalogData> {
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
