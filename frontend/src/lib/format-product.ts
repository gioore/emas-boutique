export interface ProductRow {
  id: number;
  name: string;
  slug: string;
  price: number;
  old_price: number | null;
  category: string | null;
  subcategory: string | null;
  category_id: number | null;
  subcategory_id: number | null;
  description: string | null;
  sizes: string[] | null;
  images: unknown;
  featured: boolean | null;
  brand_id: number | null;
  sku: string | null;
  availability: string | null;
  new_arrival: boolean | null;
  on_sale: boolean | null;
  colors: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  // joined fields
  cat_id?: number;
  cat_name?: string;
  cat_slug?: string;
  subcat_id?: number;
  subcat_name?: string;
  subcat_slug?: string;
  brand_name?: string;
  brand_slug?: string;
  [key: string]: unknown;
}

export interface FormattedImage {
  id: number; url: string; alternativeText: string | null; name: string; width: number; height: number;
}

export interface FormattedProduct {
  id: number; name: string; slug: string; price: number;
  oldPrice: number | null; category: string; subcategory: string;
  category_id: number | null; subcategory_id: number | null; brand_id: number | null;
  description: string; sizes: string[]; images: FormattedImage[];
  featured: boolean; sku: string | null; availability: string | null;
  newArrival: boolean; onSale: boolean; colors: string[]; tags: string[];
  createdAt: string; updatedAt: string;
  cat: { id: number; name?: string; slug?: string | null } | null;
  subcat: { id: number; name?: string; slug?: string | null } | null;
  brand: { id: number; name?: string; slug?: string | null } | null;
}

export function formatProduct(p: ProductRow | null | undefined): FormattedProduct | null {
  if (!p) return null;
  let images: FormattedImage[] = [];
  if (typeof p.images === 'string') {
    try { images = JSON.parse(p.images); } catch { images = []; }
  } else if (Array.isArray(p.images)) {
    images = p.images as FormattedImage[];
  }
  const cat = p.cat_id
    ? { id: p.cat_id, name: p.cat_name || '', slug: p.cat_slug || '' }
    : p.category_id
      ? { id: p.category_id, name: p.category || '', slug: (p.category || '').toLowerCase().replace(/\s+/g, '-') }
      : null;
  const subcat = p.subcat_id
    ? { id: p.subcat_id, name: p.subcat_name || '', slug: p.subcat_slug || '' }
    : p.subcategory_id
      ? { id: p.subcategory_id, name: p.subcategory || '', slug: (p.subcategory || '').toLowerCase().replace(/\s+/g, '-') }
      : null;
  const brand = p.brand_id
    ? { id: p.brand_id, name: p.brand_name || '', slug: p.brand_slug || '' }
    : null;
  return {
    id: p.id, name: p.name, slug: p.slug, price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : null,
    category: p.category || '', subcategory: p.subcategory || '',
    category_id: p.category_id, subcategory_id: p.subcategory_id, brand_id: p.brand_id,
    description: p.description || '', sizes: p.sizes || [],
    images: images.map((img) => ({
      id: (img as any).id ?? 0, url: (img as any).url ?? '',
      alternativeText: ((img as any).alternativeText ?? (img as any).alt) ?? null,
      name: ((img as any).name ?? (img as any).alt) ?? '',
      width: (img as any).width ?? 800, height: (img as any).height ?? 800,
    })),
    featured: !!p.featured, sku: p.sku || null,
    availability: p.availability || 'available',
    newArrival: !!p.new_arrival, onSale: !!p.on_sale,
    colors: p.colors || [], tags: p.tags || [],
    createdAt: p.created_at, updatedAt: p.updated_at,
    cat, subcat, brand,
  };
}
