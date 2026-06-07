'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SubcategoryForm from '@/components/admin/SubcategoryForm';

interface SubcategoryData {
  id: number;
  name: string;
  category: string;
  order: number;
  active: boolean;
}

export default function EditarSubcategoriaPage() {
  const params = useParams();
  const [subcategory, setSubcategory] = useState<SubcategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSubcategory = async () => {
      try {
        const res = await fetch('/api/admin/subcategories');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        const found = (data.data ?? []).find((s: { id: number }) => String(s.id) === params.id);
        if (found) {
          setSubcategory({
            id: found.id,
            name: found.name,
            category: found.category_id?.toString() || '',
            order: found.order,
            active: found.active,
          });
        } else {
          setError('Subcategoría no encontrada');
        }
      } catch {
        setError('Error al cargar subcategoría');
      } finally {
        setLoading(false);
      }
    };
    loadSubcategory();
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
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Editar Subcategoría</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Modifica los datos de la subcategoría</p>
      </div>
      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <SubcategoryForm initialData={subcategory ?? undefined} isEditing />
      </div>
    </div>
  );
}
