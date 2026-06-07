'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';

export default function EditarCategoriaPage() {
  const params = useParams();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        const found = data.data?.find((c: any) => String(c.id) === params.id);
        if (found) {
          setCategory({
            id: found.id,
            name: found.name,
            description: found.description,
            order: found.order,
            active: found.active,
          });
        } else {
          setError('Categoría no encontrada');
        }
      } catch {
        setError('Error al cargar categoría');
      } finally {
        setLoading(false);
      }
    };
    loadCategory();
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
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Editar Categoría</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Modifica los datos de la categoría</p>
      </div>

      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <CategoryForm initialData={category} isEditing />
      </div>
    </div>
  );
}
