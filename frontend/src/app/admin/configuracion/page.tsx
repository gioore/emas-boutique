'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';

interface StatsCard {
  label: string;
  value: number;
  href: string;
  color: string;
  bg: string;
}

interface ProductRow {
  id: number;
  name: string;
  price: number;
  availability: string;
  created_at: string;
}

export default function AdminDashboardConfig() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
      fetch('/api/admin/subcategories').then((r) => r.json()),
      fetch('/api/admin/brands').then((r) => r.json()),
    ]).then(([p, c, s, b]) => {
      if (p.data) setProducts(p.data);
      if (c.data) setCategories(c.data);
      if (s.data) setSubcategories(s.data);
      if (b.data) setBrands(b.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const total = products.length;
  const outOfStock = products.filter((p: any) => p.availability === 'out_of_stock').length;
  const onSale = products.filter((p: any) => p.on_sale).length;
  const newArrivals = products.filter((p: any) => p.new_arrival).length;
  const featured = products.filter((p: any) => p.featured).length;

  const sorted = [...products].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const cards: StatsCard[] = [
    { label: 'Productos', value: total, href: '/admin/productos', color: '#1c1917', bg: '#f5f0e8' },
    { label: 'Categorías', value: categories.length, href: '/admin/categorias', color: '#1c1917', bg: '#f5f0e8' },
    { label: 'Subcategorías', value: subcategories.length, href: '/admin/subcategorias', color: '#1c1917', bg: '#f5f0e8' },
    { label: 'Marcas', value: brands.length, href: '/admin/marcas', color: '#1c1917', bg: '#f5f0e8' },
    { label: 'Agotados', value: outOfStock, href: '/admin/productos', color: '#991b1b', bg: '#fef2f2' },
    { label: 'En Oferta', value: onSale, href: '/admin/productos', color: '#c76f4b', bg: '#fff7ed' },
    { label: 'Nuevos', value: newArrivals, href: '/admin/productos', color: '#4a7c59', bg: '#f0fdf4' },
    { label: 'Destacados', value: featured, href: '/admin/productos', color: '#d4a373', bg: '#fffbeb' },
  ];

  const quickLinks = [
    { label: 'Productos', href: '/admin/productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Categorías', href: '/admin/categorias', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Subcategorías', href: '/admin/subcategorias', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { label: 'Marcas', href: '/admin/marcas', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
    { label: 'Nuevo Producto', href: '/admin/productos/nuevo', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: '#1c1917', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Dashboard</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Resumen general de tu tienda</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border p-5 transition-all hover:shadow-md"
            style={{ backgroundColor: card.bg, borderColor: '#e5e0d8' }}
          >
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: '#78716c' }}>{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#1c1917' }}>Acceso Rápido</h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-sm"
              style={{ backgroundColor: '#f5f0e8', color: '#44403c' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Last 5 products */}
      <div className="rounded-xl border overflow-hidden mb-8" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e0d8' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#1c1917' }}>Últimos Productos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ backgroundColor: '#faf7f2', borderColor: '#e5e0d8' }}>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Precio</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Disponibilidad</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Fecha</th>
                <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#e5e0d8' }}>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm" style={{ color: '#78716c' }}>No hay productos aún</td>
                </tr>
              ) : sorted.map((p: any) => (
                <tr key={p.id} className="transition-colors hover:bg-[#faf7f2]">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium" style={{ color: '#1c1917' }}>{p.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: '#1c1917' }}>Q{Number(p.price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: p.availability === 'available' ? '#f0fdf4' : p.availability === 'out_of_stock' ? '#fef2f2' : '#fffbeb',
                        color: p.availability === 'available' ? '#4a7c59' : p.availability === 'out_of_stock' ? '#991b1b' : '#a16244',
                      }}
                    >
                      {p.availability === 'available' ? 'Disponible' : p.availability === 'out_of_stock' ? 'Agotado' : p.availability === 'low_stock' ? 'Pocos' : 'Pedido'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: '#78716c' }}>{new Date(p.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/productos/${p.id}/editar`} className="text-xs font-medium transition-colors" style={{ color: '#d4a373' }}>
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact info */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#1c1917' }}>Información de Contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm" style={{ color: '#78716c' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {SITE_CONFIG.whatsappDisplay}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {SITE_CONFIG.email}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            @{SITE_CONFIG.instagram}
          </div>
        </div>
      </div>
    </div>
  );
}
