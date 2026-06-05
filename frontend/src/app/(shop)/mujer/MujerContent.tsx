'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import type { Product, Brand, Category, Subcategory } from '@/types/product';

export default function MujerContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    subcategory: searchParams.get('subcategoria') || '',
    brand: searchParams.get('marca') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('talla') || '',
    availability: searchParams.get('disponibilidad') || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, brandRes, catRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/products?populate=*`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/brands?populate=*`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/categories?populate=subcategories&sort=order:asc`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }),
        ]);
        const prodData = await prodRes.json();
        const brandData = await brandRes.json();
        const catData = await catRes.json();
        setProducts(prodData.data || []);
        setBrands(brandData.data || []);
        setCategories(catData.data || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const mujerSubcategories: string[] = useMemo(() => {
    const mujerCat = categories.find((c) => c.name?.toLowerCase() === 'mujer');
    if (!mujerCat) return [];
    const subs = (mujerCat as any).subcategories || [];
    return subs.map((s: Subcategory) => s.name).filter(Boolean);
  }, [categories]);

  const filtered = useMemo(() => {
    let result = [...products];

    result = result.filter((p) => p.cat?.name?.toLowerCase() === 'mujer');

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q)));
    }
    if (filters.subcategory) result = result.filter((p) => p.subcat?.name === filters.subcategory);
    if (filters.brand) result = result.filter((p) => p.brand?.documentId === filters.brand);
    if (filters.size) result = result.filter((p) => p.sizes?.includes(filters.size));
    if (filters.availability) result = result.filter((p) => p.availability === filters.availability);
    if (filters.minPrice) result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    switch (filters.sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [products, filters]);

  const updateFilter = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ subcategory: '', brand: '', sort: 'newest', search: '', minPrice: '', maxPrice: '', size: '', availability: '' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.white }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>Categoría</span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Mujer</h1>
          <p className="mt-2" style={{ color: BRAND_COLORS.textMuted }}>Vestidos, blusas, pantalones y accesorios importados</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: BRAND_COLORS.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Buscar en Mujer..." value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-colors"
              style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }} />
          </div>
          <div className="flex gap-3">
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-3 border rounded-xl outline-none text-sm"
              style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }}>
              <option value="newest">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              style={{ borderColor: '#e5e0d8', backgroundColor: showFilters ? BRAND_COLORS.primary : BRAND_COLORS.white, color: showFilters ? BRAND_COLORS.white : BRAND_COLORS.text }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 rounded-xl border" style={{ backgroundColor: BRAND_COLORS.white, borderColor: '#e5e0d8' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND_COLORS.textMuted }}>Subcategoría</label>
                <select value={filters.subcategory} onChange={(e) => updateFilter('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {mujerSubcategories.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND_COLORS.textMuted }}>Marca</label>
                <select value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {brands.filter(b => b.active !== false).map((b) => (<option key={b.documentId} value={b.documentId}>{b.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND_COLORS.textMuted }}>Disponibilidad</label>
                <select value={filters.availability} onChange={(e) => updateFilter('availability', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  <option value="available">Disponible</option>
                  <option value="low_stock">Últimas unidades</option>
                  <option value="out_of_stock">Agotado</option>
                  <option value="pre_order">Bajo pedido</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND_COLORS.textMuted }}>Talla</label>
                <select value={filters.size} onChange={(e) => updateFilter('size', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {['XS','S','M','L','XL','2XL','3XL','Única','36','37','38','39','40','41','42'].map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND_COLORS.textMuted }}>Precio mín</label>
                <input type="number" placeholder="Q0" value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND_COLORS.textMuted }}>Precio máx</label>
                <input type="number" placeholder="Q1000" value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} />
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.textMuted }}>Limpiar</button>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm mb-8" style={{ color: BRAND_COLORS.textMuted }}>
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#d6d3d1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-lg" style={{ color: BRAND_COLORS.textMuted }}>No hay productos disponibles.</p>
            <p className="text-sm mt-2" style={{ color: '#a8a29e' }}>Próximamente estaremos agregando nuevos productos importados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
