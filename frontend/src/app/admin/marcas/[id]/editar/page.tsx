'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BrandForm from '@/components/admin/BrandForm';

interface BrandData {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  active: boolean;
}

export default function EditarMarcaPage() {
  const params = useParams();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const res = await fetch(`/api/admin/brands/${params.id}`);
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const json = await res.json();
        if (!res.ok) { setError(json.error || 'Error al cargar'); return; }
        const found = json.data;
        setBrand({
          id: found.id,
          name: found.name,
          slug: found.slug || '',
          logo_url: found.logo_url || '',
          active: found.active,
        });
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
        <Link href="/admin/marcas" className="inline-flex items-center gap-1 text-sm font-medium mb-2 transition-colors" style={{ color: '#78716c' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver a Marcas
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Editar Marca</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Modifica los datos de la marca</p>
      </div>
      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <BrandForm initialData={brand ?? undefined} isEditing />
      </div>
    </div>
  );
}
