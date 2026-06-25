'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/Skeleton';

interface Subcategory {
  id: number;
  name: string;
  order: number | null;
  active: boolean;
  category_name: string;
}

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const loadSubcategories = async () => {
    try {
      const res = await fetch('/api/admin/subcategories');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.data) {
        setSubcategories(data.data);
      }
    } catch {
      setError('Error al cargar subcategorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSubcategories(); }, []);

  useEffect(() => {
    if (!deleteId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDeleteId(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [deleteId]);

  const handleDelete = async (subcategoryId: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/subcategories/${subcategoryId}`, { method: 'DELETE' });
      if (res.ok) {
        setSubcategories((prev) => prev.filter((s) => s.id !== subcategoryId));
      } else {
        const body = await res.json();
        setError(body.error || 'Error al eliminar');
      }
    } catch {
      setError('Error al eliminar');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return subcategories;
    const q = search.toLowerCase();
    return subcategories.filter((s) =>
      s.name.toLowerCase().includes(q) || (s.category_name || '').toLowerCase().includes(q)
    );
  }, [subcategories, search]);

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
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Subcategorías</h1>
          <p className="mt-1" style={{ color: '#78716c' }}>
            {subcategories.length} subcategoría{subcategories.length !== 1 ? 's' : ''} registrada{subcategories.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/subcategorias/nueva"
          className="px-4 sm:px-5 py-2.5 font-medium rounded-lg transition-colors text-sm text-center"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
        >
          <span className="sm:hidden">+ Nueva</span>
          <span className="hidden sm:inline">+ Nueva Subcategoría</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-6 flex items-center justify-between" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-sm font-medium" style={{ color: '#991b1b' }}>X</button>
        </div>
      )}

      {subcategories.length === 0 ? (
        <div className="text-center py-20 rounded-xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h3 className="text-lg font-medium mb-1" style={{ color: '#44403c' }}>No hay subcategorías aún</h3>
          <p className="text-sm mb-4" style={{ color: '#78716c' }}>Crea tu primera subcategoría</p>
          <Link href="/admin/subcategorias/nueva" className="px-5 py-2.5 font-medium rounded-lg text-sm inline-block" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
            + Nueva Subcategoría
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar subcategorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={{ borderColor: '#d6d3d1', color: '#1c1917', backgroundColor: '#ffffff' }}
            />
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-xl border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
            <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: '#faf7f2' }}>
                  <tr className="border-b" style={{ borderColor: '#e5e0d8' }}>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Nombre</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Categoría</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Orden</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Estado</th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#e5e0d8' }}>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#78716c' }}>
                        {search ? 'No hay subcategorías que coincidan con la búsqueda' : 'No hay subcategorías aún'}
                      </td>
                    </tr>
                  ) : filtered.map((subcategory) => (
                    <tr key={subcategory.id} className="transition-colors hover:bg-[#faf7f2]" style={{ backgroundColor: '#ffffff' }}>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium" style={{ color: '#1c1917' }}>{subcategory.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm" style={{ color: '#78716c' }}>{subcategory.category_name || '—'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm" style={{ color: '#78716c' }}>{subcategory.order ?? '—'}</span>
                      </td>
                      <td className="px-4 py-4">
                        {subcategory.active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f5f5f4', color: '#57534e' }}>
                            Inactiva
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/subcategorias/${subcategory.id}/editar`}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                            style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => setDeleteId(subcategory.id)}
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

          {/* Mobile cards */}
          <div className="block sm:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-sm" style={{ color: '#78716c' }}>
                {search ? 'No hay subcategorías que coincidan con la búsqueda' : 'No hay subcategorías aún'}
              </div>
            ) : filtered.map((subcategory) => (
              <div key={subcategory.id} className="rounded-xl border p-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: '#1c1917' }}>{subcategory.name}</span>
                  {subcategory.active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: '#f5f5f4', color: '#57534e' }}>
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="text-xs mb-1" style={{ color: '#78716c' }}>
                  Categoría: {subcategory.category_name || '—'}
                </p>
                <p className="text-xs mb-3" style={{ color: '#78716c' }}>Orden: {subcategory.order ?? '—'}</p>
                <div className="flex gap-2 pt-3 border-t" style={{ borderColor: '#e5e0d8' }}>
                  <Link
                    href={`/admin/subcategorias/${subcategory.id}/editar`}
                    className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setDeleteId(subcategory.id)}
                    className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-xl p-6 max-w-sm w-full shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1c1917' }}>¿Eliminar subcategoría?</h3>
            <p className="text-sm mb-6" style={{ color: '#78716c' }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border font-medium rounded-lg transition-colors text-sm" style={{ backgroundColor: '#ffffff', borderColor: '#d6d3d1', color: '#44403c' }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteId!)} disabled={deleting} className="px-4 py-2 font-medium rounded-lg disabled:opacity-50 transition-colors text-sm" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
