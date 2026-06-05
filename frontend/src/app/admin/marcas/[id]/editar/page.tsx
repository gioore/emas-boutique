'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BrandForm from '@/components/admin/BrandForm';

export default function EditarMarcaPage() {
  const params = useParams();
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const res = await fetch('/api/admin/brands');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        const found = data.data?.find((b: any) => b.documentId === params.id);
        if (found) {
          setBrand({
            documentId: found.documentId,
            name: found.name,
            active: found.active,
            logo: found.logo || null,
          });
        } else {
          setError('Marca no encontrada');
        }
      } catch {
        setError('Error al cargar marca');
      } finally {
        setLoading(false);
      }
    };
    loadBrand();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: '#1c1917', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Editar Marca</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Modifica los datos de la marca</p>
      </div>

      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <BrandForm initialData={brand} isEditing />
      </div>
    </div>
  );
}
