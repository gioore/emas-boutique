'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { BRAND_COLORS, SITE_CONFIG } from '@/lib/config';
import { SIZE_OPTIONS } from '@/lib/constants';
import type { CategoryWithSubcategories, CatalogSection } from '@/lib/catalog';
import type { Brand, Product, Subcategory } from '@/types/product';

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

interface Props {
  mode: CatalogSection;
  title: string;
  subtitle: string;
  products: Product[];
  brands: Brand[];
  categories: CategoryWithSubcategories[];
  error?: string;
}

function normalize(value?: string | null): string {
  return (value || '').toLowerCase();
}

function getCategoryKey(product: Product): string {
  return normalize(product.cat?.slug || product.cat?.name || product.category);
}

function getSubcategoriesForMode(categories: CategoryWithSubcategories[], mode: CatalogSection): string[] {
  return mode !== 'all'
    ? categories
        .filter((category) => category.name?.toLowerCase() === mode)
        .flatMap((category) => (category.subcategories || []).map((subcategory) => subcategory.name))
        .filter((name): name is string => Boolean(name))
    : categories.flatMap((category) => (category.subcategories || []).map((subcategory) => subcategory.name)).filter((name): name is string => Boolean(name));
}

const PAGE_SIZE = 20;

export default function CatalogView({ mode, title, subtitle, products, brands, categories, error }: Props) {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [page, setPage] = useState(1);
  const sortBarRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<Filters>({
    category: mode === 'all' ? searchParams.get('categoria') || '' : '',
    subcategory: searchParams.get('subcategoria') || '',
    brand: searchParams.get('marca') || '',
    size: searchParams.get('talla') || '',
    availability: searchParams.get('disponibilidad') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    if (!sortBarRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sortBarRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', showFilters);
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [showFilters]);

  const allSubcategories = useMemo(() => getSubcategoriesForMode(categories, mode), [categories, mode]);

  const filteredSubcategories = useMemo(() => {
    if (mode !== 'all' || !filters.category) return allSubcategories;
    const selectedCategory = categories.find((category) => String(category.id) === filters.category);
    return (selectedCategory?.subcategories || [])
      .filter((subcategory: Subcategory) => subcategory.active !== false)
      .map((subcategory: Subcategory) => subcategory.name)
      .filter(Boolean);
  }, [allSubcategories, categories, filters.category, mode]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (mode !== 'all') result = result.filter((product) => getCategoryKey(product) === mode);
    if (filters.search) {
      const query = normalize(filters.search);
      result = result.filter((product) =>
        normalize(product.name).includes(query) ||
        normalize(product.description).includes(query) ||
        product.tags?.some((tag) => normalize(tag).includes(query))
      );
    }
    if (mode === 'all' && filters.category) result = result.filter((product) => String(product.cat?.id) === filters.category);
    if (filters.subcategory) result = result.filter((product) => product.subcat?.name === filters.subcategory || product.subcategory === filters.subcategory);
    if (filters.brand) result = result.filter((product) => String(product.brand?.id) === filters.brand);
    if (filters.size) result = result.filter((product) => product.sizes?.includes(filters.size));
    if (filters.availability) result = result.filter((product) => product.availability === filters.availability);
    if (filters.minPrice) result = result.filter((product) => product.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) result = result.filter((product) => product.price <= parseFloat(filters.maxPrice));
    switch (filters.sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [filters, mode, products]);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => key !== 'sort' && value);
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => key !== 'sort' && value).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', brand: '', size: '', availability: '', minPrice: '', maxPrice: '', sort: 'newest', search: '' });
    setPage(1);
  };

  const FilterContent = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mode === 'all' && (
        <div>
          <label htmlFor="filter-category" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Categoria</label>
          <select id="filter-category" value={filters.category} onChange={(event) => { updateFilter('category', event.target.value); updateFilter('subcategory', ''); }} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
            <option value="">Todas</option>
            {categories.filter((category) => category.active !== false).map((category) => (
              <option key={category.id} value={String(category.id)}>{category.name}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="filter-subcategory" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Subcategoria</label>
        <select id="filter-subcategory" value={filters.subcategory} onChange={(event) => updateFilter('subcategory', event.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
          <option value="">Todas</option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>{subcategory}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-brand" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Marca</label>
        <select id="filter-brand" value={filters.brand} onChange={(event) => updateFilter('brand', event.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
          <option value="">Todas</option>
          {brands.filter((brand) => brand.active !== false).map((brand) => (
            <option key={brand.id} value={String(brand.id)}>{brand.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-availability" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Disponibilidad</label>
        <select id="filter-availability" value={filters.availability} onChange={(event) => updateFilter('availability', event.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
          <option value="">Todas</option>
          <option value="available">Disponible</option>
          <option value="low_stock">Ultimas unidades</option>
          <option value="out_of_stock">Agotado</option>
          <option value="pre_order">Bajo pedido</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-size" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Talla</label>
        <select id="filter-size" value={filters.size} onChange={(event) => updateFilter('size', event.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }}>
          <option value="">Todas</option>
          {SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-minPrice" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Precio mínimo</label>
        <input id="filter-minPrice" type="number" min="0" placeholder="Q0" value={filters.minPrice} onChange={(event) => updateFilter('minPrice', event.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} />
      </div>
      <div>
        <label htmlFor="filter-maxPrice" className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>Precio máximo</label>
        <input id="filter-maxPrice" type="number" min="0" placeholder="Q1000" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} />
      </div>
      <div className="flex items-end">
        <button onClick={clearFilters} className="px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.textMuted }}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: mode === 'all' ? BRAND_COLORS.background : BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: mode === 'all' ? BRAND_COLORS.white : BRAND_COLORS.background, borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium mb-2" style={{ color: BRAND_COLORS.textMuted }}>
            <span>{mode === 'all' ? SITE_CONFIG.name : 'Categoria'}</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS.gold }} />
            )}
          </div>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>{title}</h1>
          <p className="mt-2" style={{ color: BRAND_COLORS.textMuted }}>{subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ backgroundColor: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>
            {error}
          </div>
        )}

        {/* Search & Sort bar */}
        <div ref={sortBarRef} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: BRAND_COLORS.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={`Buscar en ${title}...`}
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-colors"
              style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }}
            />
          </div>
          <div className="flex gap-3">
            <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)} className="px-4 py-3 border rounded-xl outline-none text-sm" style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }}>
              <option value="newest">Mas recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
            <button onClick={() => setShowFilters(true)} className="relative px-4 py-3 border rounded-xl text-sm font-medium transition-colors flex items-center gap-2" style={{ borderColor: '#e5e0d8', backgroundColor: hasActiveFilters ? BRAND_COLORS.primary : BRAND_COLORS.white, color: hasActiveFilters ? BRAND_COLORS.white : BRAND_COLORS.text }} aria-label="Abrir filtros">
              Filtros
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold" style={{ backgroundColor: BRAND_COLORS.gold, color: '#1c1917' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sticky sort bar */}
        {sticky && (
          <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b shadow-sm" style={{ backgroundColor: 'rgba(250,247,242,0.95)', backdropFilter: 'blur-sm', borderColor: '#e5e0d8' }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-sm" style={{ color: BRAND_COLORS.textMuted }}>
                {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-3">
                <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)} className="px-3 py-2 border rounded-lg outline-none text-xs" style={{ borderColor: '#e5e0d8', backgroundColor: BRAND_COLORS.white, color: BRAND_COLORS.text }}>
                  <option value="newest">Mas recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name-asc">A-Z</option>
                  <option value="name-desc">Z-A</option>
                </select>
                <button onClick={() => setShowFilters(true)} className="px-3 py-2 border rounded-lg text-xs font-medium" style={{ borderColor: '#e5e0d8', color: BRAND_COLORS.text }} aria-label="Abrir filtros">
                  Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop inline filters */}
        <div className="hidden lg:block">
          {showFilters && (
            <div className="mb-8 p-6 rounded-xl border animate-scale-in" style={{ backgroundColor: BRAND_COLORS.white, borderColor: '#e5e0d8' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_COLORS.text }}>Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="text-sm" style={{ color: BRAND_COLORS.textMuted }} aria-label="Cerrar filtros">Cerrar</button>
              </div>
              <FilterContent />
            </div>
          )}
        </div>

        {/* Mobile slide-in drawer */}
        {showFilters && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" onClick={() => setShowFilters(false)} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
            <div
              className="fixed top-0 left-0 h-full w-80 z-50 overflow-y-auto shadow-2xl animate-slide-in-left"
              style={{ backgroundColor: BRAND_COLORS.background }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_COLORS.text }}>Filtros</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-[#e5e0d8] transition-colors" aria-label="Cerrar filtros">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: BRAND_COLORS.text }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterContent />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: BRAND_COLORS.textMuted }}>
            Página {safePage} — {paginated.length} de {filtered.length} producto{filtered.length !== 1 ? 's' : ''}{hasActiveFilters && ' encontrados'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <>
            <div role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {paginated.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => goToPage(safePage - 1)} disabled={safePage <= 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
                  style={{ backgroundColor: '#f5f0e8', color: '#44403c' }}>
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => goToPage(p)}
                    className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: p === safePage ? '#d4a373' : '#f5f0e8', color: p === safePage ? '#ffffff' : '#44403c' }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => goToPage(safePage + 1)} disabled={safePage >= totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
                  style={{ backgroundColor: '#f5f0e8', color: '#44403c' }}>
                  Siguiente
                </button>
              </div>
            )}
          </> 
        ) : (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: BRAND_COLORS.textMuted }}>No se encontraron productos.</p>
            <p className="text-sm mt-2" style={{ color: '#78716c' }}>Intenta ajustar los filtros o buscar con otros términos.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors" style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
