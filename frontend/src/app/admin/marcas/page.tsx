'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/Skeleton';

interface Brand {
  id: number;
  name: string;
  slug: string | null;
  active: boolean;
  logo_url: string | null;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.data) {
        setBrands(data.data);
      }
    } catch {
      setError('Error al cargar marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBrands(); }, []);

  const handleDelete = async (brandId: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/brands/${brandId}`, { method: 'DELETE' });
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== brandId));
      }
    } catch {
      setError('Error al eliminar');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

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
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Marcas</h1>
          <p className="mt-1" style={{ color: '#78716c' }}>
            {brands.length} marca{brands.length !== 1 ? 's' : ''} registrada{brands.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/marcas/nueva"
          className="px-5 py-2.5 font-medium rounded-lg transition-colors text-sm"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
        >
          + Nueva Marca
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-6" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {brands.length === 0 ? (
        <div className="text-center py-20 rounded-xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h3 className="text-lg font-medium mb-1" style={{ color: '#44403c' }}>No hay marcas aún</h3>
          <p className="text-sm mb-4" style={{ color: '#78716c' }}>Crea tu primera marca</p>
          <Link href="/admin/marcas/nueva" className="px-5 py-2.5 font-medium rounded-lg text-sm inline-block" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
            + Nueva Marca
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ backgroundColor: '#faf7f2', borderColor: '#e5e0d8' }}>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Marca</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#78716c' }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#e5e0d8' }}>
                {brands.map((brand) => (
                  <tr key={brand.id} className="transition-colors" style={{ backgroundColor: '#ffffff' }}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium" style={{ color: '#1c1917' }}>{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {brand.active ? (
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
                          href={`/admin/marcas/${brand.id}/editar`}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                          style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteId(brand.id)}
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
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-xl p-6 max-w-sm w-full shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1c1917' }}>¿Eliminar marca?</h3>
            <p className="text-sm mb-6" style={{ color: '#78716c' }}>Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border font-medium rounded-lg transition-colors text-sm" style={{ borderColor: '#d6d3d1', color: '#44403c' }}>
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
