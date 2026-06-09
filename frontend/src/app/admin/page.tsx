'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/images';
import { TableSkeleton } from '@/components/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  category: string;
  subcategory: string;
  category_id: number | null;
  subcategory_id: number | null;
  featured: boolean;
  new_arrival: boolean;
  on_sale: boolean;
  availability: string;
  sku?: string;
  brand_id: number | null;
  brand_name?: string;
  cat_name?: string;
  subcat_name?: string;
  images: { id: number; url: string }[];
  created_at: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!deleteId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDeleteId(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [deleteId]);

  const handleDelete = async (productId: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch {
      setError('Error al eliminar');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const metrics = {
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    onSale: products.filter((p) => p.on_sale).length,
    newArrivals: products.filter((p) => p.new_arrival).length,
    outOfStock: products.filter((p) => p.availability === 'out_of_stock').length,
    lowStock: products.filter((p) => p.availability === 'low_stock').length,
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-36 rounded animate-pulse" style={{ backgroundColor: '#e5e0d8' }} />
            <div className="h-4 w-48 mt-2 rounded animate-pulse" style={{ backgroundColor: '#e5e0d8' }} />
          </div>
          <div className="h-10 w-40 rounded-lg animate-pulse" style={{ backgroundColor: '#e5e0d8' }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 animate-pulse" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
              <div className="h-7 w-12 rounded" style={{ backgroundColor: '#e5e0d8' }} />
              <div className="h-3 w-20 mt-2 rounded" style={{ backgroundColor: '#e5e0d8' }} />
            </div>
          ))}
        </div>
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Dashboard</h1>
          <p className="mt-1" style={{ color: '#78716c' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''} registrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-5 py-2.5 font-medium rounded-lg transition-colors text-sm"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
        >
          + Nuevo Producto
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-6" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-2xl font-bold" style={{ color: '#1c1917' }}>{metrics.total}</p>
          <p className="text-xs mt-1" style={{ color: '#78716c' }}>Total productos</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-2xl font-bold" style={{ color: '#166534' }}>{metrics.featured}</p>
          <p className="text-xs mt-1" style={{ color: '#78716c' }}>Destacados</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>{metrics.onSale}</p>
          <p className="text-xs mt-1" style={{ color: '#78716c' }}>En oferta</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-2xl font-bold" style={{ color: '#92400e' }}>{metrics.newArrivals}</p>
          <p className="text-xs mt-1" style={{ color: '#78716c' }}>Nuevos ingresos</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>{metrics.outOfStock}</p>
          <p className="text-xs mt-1" style={{ color: '#78716c' }}>Agotados</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-2xl font-bold" style={{ color: '#92400e' }}>{metrics.lowStock}</p>
          <p className="text-xs mt-1" style={{ color: '#78716c' }}>Últimas unidades</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border rounded-lg outline-none"
          style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 rounded-xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h3 className="text-lg font-medium mb-1" style={{ color: '#44403c' }}>No hay productos aún</h3>
          <p className="text-sm mb-4" style={{ color: '#78716c' }}>Crea tu primer producto para empezar</p>
          <Link href="/admin/productos/nuevo" className="px-5 py-2.5 font-medium rounded-lg text-sm inline-block" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
            + Nuevo Producto
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <p className="text-lg" style={{ color: '#78716c' }}>No se encontraron productos con ese nombre.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ backgroundColor: '#faf7f2', borderColor: '#e5e0d8' }}>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Producto</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: '#78716c' }}>Marca</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: '#78716c' }}>Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Precio</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hidden sm:table-cell" style={{ color: '#78716c' }}>Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#e5e0d8' }}>
                {filtered.map((product) => (
                  <tr key={product.id} className="transition-colors" style={{ backgroundColor: '#ffffff' }}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#f5f0e8' }}>
                          {product.images?.[0] && (
                            <Image
                              src={getImageUrl(product.images[0])}
                              alt=""
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-medium block" style={{ color: '#1c1917' }}>
                            {product.name.length > 30 ? product.name.slice(0, 30) + '...' : product.name}
                          </span>
                          {product.sku && (
                            <span className="text-xs" style={{ color: '#78716c' }}>{product.sku}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm" style={{ color: '#57534e' }}>
                        {product.brand_name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm capitalize" style={{ color: '#57534e' }}>{product.cat_name || product.category}</span>
                      <span className="text-xs ml-1" style={{ color: '#78716c' }}>/ {product.subcat_name || product.subcategory}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <span className="text-sm font-medium" style={{ color: '#1c1917' }}>Q{product.price.toFixed(2)}</span>
                        {product.on_sale && product.old_price && (
                          <span className="text-xs line-through ml-1" style={{ color: '#78716c' }}>Q{Number(product.old_price).toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>Destacado</span>
                        )}
                        {product.new_arrival && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Nuevo</span>
                        )}
                        {product.on_sale && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>Oferta</span>
                        )}
                        {product.availability === 'out_of_stock' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f5f5f4', color: '#57534e' }}>Agotado</span>
                        )}
                        {(!product.featured && !product.new_arrival && !product.on_sale) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>Activo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${product.id}/editar`}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                          style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                          style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-xl p-6 max-w-sm w-full shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1c1917' }}>¿Eliminar producto?</h3>
            <p className="text-sm mb-6" style={{ color: '#78716c' }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border font-medium rounded-lg text-sm" style={{ borderColor: '#d6d3d1', color: '#44403c' }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteId!)} disabled={deleting} className="px-4 py-2 font-medium rounded-lg disabled:opacity-50 text-sm" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
