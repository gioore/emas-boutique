'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BrandFormData {
  name: string;
  active: boolean;
}

interface Props {
  initialData?: Partial<BrandFormData> & { documentId?: string };
  isEditing?: boolean;
}

export default function BrandForm({ initialData, isEditing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<BrandFormData>({
    name: initialData?.name || '',
    active: initialData?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const body = {
      data: {
        name: form.name,
        active: form.active,
      },
    };

    try {
      const url = isEditing
        ? `/api/admin/brands/${initialData?.documentId}`
        : '/api/admin/brands';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al guardar');
      }

      setSuccess(isEditing ? 'Marca actualizada exitosamente' : 'Marca creada exitosamente');
      setTimeout(() => router.push('/admin/marcas'), 1500);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la marca');
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
        <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Nombre de la marca *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
          style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
          placeholder="Ej: Coach, Nike, Michael Kors"
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
          <span className="text-sm font-medium" style={{ color: '#44403c' }}>Marca activa</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t" style={{ borderColor: '#e5e0d8' }}>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 font-medium rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
        >
          {saving ? 'Guardando...' : isEditing ? 'Actualizar Marca' : 'Crear Marca'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/marcas')}
          className="px-8 py-3 border font-medium rounded-lg transition-colors"
          style={{ borderColor: '#d6d3d1', color: '#44403c' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
