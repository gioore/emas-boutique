'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import type { Product, Brand, Category, Subcategory } from '@/types/product';

interface Filters {
  category: string;
  subcategory: string;
  brand: string;
  size: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  search: string;
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Única', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    category: '',
    subcategory: '',
    brand: '',
    size: '',
    availability: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    search: '',
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

  const allSubcategories = useMemo(() => {
    const names = new Set<string>();
    for (const cat of categories) {
      const subs = (cat as any).subcategories || [];
      for (const sub of subs) {
        if (sub.name) names.add(sub.name);
      }
    }
    return [...names];
  }, [categories]);

  const filteredSubcategories: string[] = useMemo(() => {
    if (!filters.category) return allSubcategories;
    const selectedCat = categories.find((c) => c.documentId === filters.category);
    if (!selectedCat) return [];
    const subs = (selectedCat as any).subcategories || [];
    return subs.map((s: Subcategory) => s.name).filter(Boolean);
  }, [categories, filters.category, allSubcategories]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.cat?.documentId === filters.category);
    }

    if (filters.subcategory) {
      result = result.filter((p) => p.subcat?.name === filters.subcategory);
    }

    if (filters.brand) {
      result = result.filter((p) => p.brand?.documentId === filters.brand);
    }

    if (filters.size) {
      result = result.filter((p) => p.sizes?.includes(filters.size));
    }

    if (filters.availability) {
      result = result.filter((p) => p.availability === filters.availability);
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, filters]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', brand: '', size: '', availability: '', minPrice: '', maxPrice: '', sort: 'newest', search: '' });
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.background }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.background }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.white, borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Catálogo</h1>
          <p className="mt-2" style={{ color: BRAND_COLORS.textMuted }}>Explora todos nuestros productos importados</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: BRAND_COLORS.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-colors"
              style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }}
            />
          </div>
          <div className="flex gap-3">
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-3 border rounded-xl outline-none text-sm"
              style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }}>
              <option value="newest">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              style={{ borderColor: '#e5e0d8', backgroundColor: showFilters ? BRAND_COLORS.primary : BRAND_COLORS.white, color: showFilters ? BRAND_COLORS.white : BRAND_COLORS.text }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS.gold }} />
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 rounded-xl border" style={{ backgroundColor: BRAND_COLORS.white, borderColor: '#e5e0d8' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Categoría</label>
                <select value={filters.category} onChange={(e) => { updateFilter('category', e.target.value); updateFilter('subcategory', ''); }}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {categories.filter(c => c.active !== false).map((cat) => (
                    <option key={cat.documentId} value={cat.documentId}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Subcategoría</label>
                <select value={filters.subcategory} onChange={(e) => updateFilter('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Marca</label>
                <select value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {brands.filter(b => b.active !== false).map((brand) => (
                    <option key={brand.documentId} value={brand.documentId}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Disponibilidad</label>
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
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Talla</label>
                <select value={filters.size} onChange={(e) => updateFilter('size', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
                  <option value="">Todas</option>
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Precio mínimo</label>
                <input type="number" min="0" placeholder="Q0" value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Precio máximo</label>
                <input type="number" min="0" placeholder="Q1000" value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} />
              </div>

              <div className="flex items-end">
                <button onClick={clearFilters}
                  className="px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full"
                  style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.textMuted }}>
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: BRAND_COLORS.textMuted }}>
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' encontrados'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#d6d3d1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg" style={{ color: BRAND_COLORS.textMuted }}>No se encontraron productos.</p>
            <p className="text-sm mt-2" style={{ color: '#a8a29e' }}>Intenta ajustar los filtros o buscar con otros términos.</p>
            <button onClick={clearFilters} className="mt-4 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors" style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
