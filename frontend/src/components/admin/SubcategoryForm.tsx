'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryOption {
  id: number;
  name: string;
}

interface SubcategoryFormData {
  name: string;
  category: string;
  order: number;
  active: boolean;
}

interface Props {
  initialData?: Partial<SubcategoryFormData> & { id?: number };
  isEditing?: boolean;
}

export default function SubcategoryForm({ initialData, isEditing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [form, setForm] = useState<SubcategoryFormData>({
    name: initialData?.name || '',
    category: initialData?.category || '',
    order: initialData?.order ?? 0,
    active: initialData?.active ?? true,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        if (data.data) {
          setCategories(data.data);
        }
      } catch {
        setError('Error al cargar categorías');
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    setErrors({});

    const fieldErrors: Record<string, string> = {};
    if (!form.name.trim()) fieldErrors.name = 'El nombre es requerido';
    if (!form.category) fieldErrors.category = 'Debes seleccionar una categoría';
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); setSaving(false); return; }

    const body = {
      data: {
        name: form.name,
        category_id: form.category ? parseInt(form.category) : null,
        order: Number(form.order),
        active: form.active,
      },
    };

    try {
      const url = isEditing
        ? `/api/admin/subcategories/${initialData?.id}`
        : '/api/admin/subcategories';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al guardar');
      }

      setSuccess(isEditing ? 'Subcategoría actualizada exitosamente' : 'Subcategoría creada exitosamente');
      setTimeout(() => router.push('/admin/subcategorias'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar la subcategoría');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Nombre de la subcategoría *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#d4a373]"
          style={{ borderColor: errors.name ? '#dc2626' : '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
          placeholder="Ej: Carteras de Cuero, Relojes Deportivos"
        />
        {errors.name && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Categoría *</label>
        <select
          required
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#d4a373]"
          style={{ borderColor: errors.category ? '#dc2626' : '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Orden</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
          className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#d4a373]"
          style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
          placeholder="0"
        />
      </div>

      <div className="flex items-center">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            className="w-5 h-5 rounded"
            style={{ borderColor: '#d6d3d1' }}
          />
          <span className="text-sm font-medium" style={{ color: '#44403c' }}>Subcategoría activa</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t" style={{ borderColor: '#e5e0d8' }}>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 font-medium rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
        >
          {saving ? 'Guardando...' : isEditing ? 'Actualizar Subcategoría' : 'Crear Subcategoría'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/subcategorias')}
          className="px-8 py-3 border font-medium rounded-lg transition-colors"
          style={{ backgroundColor: '#ffffff', borderColor: '#d6d3d1', color: '#44403c' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
