const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || '';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers, next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function getStrapiURL(path: string): string {
  return `${API_URL}${path}`;
}

export function getImageUrl(image: { url: string }): string {
  if (image.url.startsWith('http')) return image.url;
  return getStrapiURL(image.url);
}

export async function getProducts(params?: Record<string, string>): Promise<import('@/types/product').ProductsResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI(`/products${query}&populate=*`);
}

export async function getProduct(slug: string): Promise<import('@/types/product').ProductResponse> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Product[] }>(
    `/products?filters[slug][$eq]=${slug}&populate=*`
  );
  const product = data[0];
  if (!product) {
    throw new Error('Product not found');
  }
  return { data: product, meta: {} };
}

export async function getFeaturedProducts(): Promise<import('@/types/product').Product[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Product[] }>(
    `/products?filters[featured][$eq]=true&populate=*`
  );
  return data;
}

export async function getNewArrivals(): Promise<import('@/types/product').Product[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Product[] }>(
    `/products?filters[newArrival][$eq]=true&populate=*&sort[0]=createdAt:desc`
  );
  return data;
}

export async function getOnSaleProducts(): Promise<import('@/types/product').Product[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Product[] }>(
    `/products?filters[onSale][$eq]=true&populate=*`
  );
  return data;
}

export async function getProductsByCategory(category: string): Promise<import('@/types/product').Product[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Product[] }>(
    `/products?filters[category][$eq]=${category}&populate=*`
  );
  return data;
}

export async function getBrands(): Promise<import('@/types/brand').Brand[]> {
  const { data } = await fetchAPI<{ data: import('@/types/brand').Brand[] }>(
    `/brands?populate=*`
  );
  return data;
}

export async function getBrand(slug: string): Promise<import('@/types/brand').Brand | null> {
  const { data } = await fetchAPI<{ data: import('@/types/brand').Brand[] }>(
    `/brands?filters[slug][$eq]=${slug}&populate=*`
  );
  return data[0] || null;
}

export async function getProductsByBrand(brandId: number): Promise<import('@/types/product').Product[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Product[] }>(
    `/products?filters[brand][id][$eq]=${brandId}&populate=*`
  );
  return data;
}

export async function getCategories(): Promise<import('@/types/product').Category[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Category[] }>(
    `/categories?populate=*&sort=order:asc`
  );
  return data;
}

export async function getSubcategories(): Promise<import('@/types/product').Subcategory[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Subcategory[] }>(
    `/subcategories?populate=*&sort=order:asc`
  );
  return data;
}

export async function getSubcategoriesByCategory(categoryId: number): Promise<import('@/types/product').Subcategory[]> {
  const { data } = await fetchAPI<{ data: import('@/types/product').Subcategory[] }>(
    `/subcategories?filters[category][id][$eq]=${categoryId}&populate=*&sort=order:asc`
  );
  return data;
}
