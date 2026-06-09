export function formatProduct(p: any): any {
  if (!p) return null;
  let images: any[] = [];
  if (typeof p.images === 'string') {
    try { images = JSON.parse(p.images); } catch { images = []; }
  } else if (Array.isArray(p.images)) {
    images = p.images;
  }
  const cat = p.cat_id
    ? { id: p.cat_id, name: p.cat_name, slug: p.cat_slug }
    : p.category_id
      ? { id: p.category_id, name: p.category || '', slug: (p.category || '').toLowerCase().replace(/\s+/g, '-') }
      : null;
  const subcat = p.subcat_id
    ? { id: p.subcat_id, name: p.subcat_name, slug: p.subcat_slug }
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
    images,
    featured: !!p.featured, sku: p.sku || null,
    availability: p.availability || 'available',
    newArrival: !!p.new_arrival, onSale: !!p.on_sale,
    colors: p.colors || [], tags: p.tags || [],
    createdAt: p.created_at, updatedAt: p.updated_at,
    cat, subcat, brand,
  };
}
