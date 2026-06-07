'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import { SITE_CONFIG } from '@/lib/config';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Única'];
const SHOE_SIZE_OPTIONS = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number | null;
}

interface ProductFormData {
  name: string;
  price: string;
  oldPrice: string;
  cat: string;
  subcat: string;
  brand: string;
  sku: string;
  description: string;
  sizes: string[];
  featured: boolean;
  availability: string;
  newArrival: boolean;
  onSale: boolean;
  colors: string;
  tags: string;
  images: { id: number; url: string }[];
}

interface Props {
  initialData?: Partial<ProductFormData> & { id?: number; cat?: any; subcat?: any };
  isEditing?: boolean;
}

function extractId(value: any): string {
  if (!value) return '';
  if (typeof value === 'object') return String(value.id);
  return String(value);
}

export default function ProductForm({ initialData, isEditing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || '',
    price: initialData?.price || '',
    oldPrice: initialData?.oldPrice || '',
    cat: extractId(initialData?.cat),
    subcat: extractId(initialData?.subcat),
    brand: initialData?.brand || '',
    sku: initialData?.sku || '',
    description: initialData?.description || '',
    sizes: initialData?.sizes || [],
    featured: initialData?.featured || false,
    availability: initialData?.availability || 'available',
    newArrival: initialData?.newArrival || false,
    onSale: initialData?.onSale || false,
    colors: initialData?.colors || '',
    tags: initialData?.tags || '',
    images: initialData?.images || [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsRes, catRes, subcatRes] = await Promise.all([
          fetch('/api/admin/brands'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/subcategories'),
        ]);

        if (brandsRes.ok) {
          const data = await brandsRes.json();
          if (data.data) setBrands(data.data);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          if (data.data) setCategories(data.data);
        }
        if (subcatRes.ok) {
          const data = await subcatRes.json();
          if (data.data) setSubcategories(data.data);
        }
      } catch {}
    };
    loadData();
  }, []);

  const filteredSubcategories = subcategories.filter((sub) => {
    return String(sub.category_id) === form.cat;
  });

  const selectedSubcat = subcategories.find((s) => String(s.id) === form.subcat);
  const showShoeSizes = selectedSubcat?.name === 'Calzado';
  const sizeOptions = showShoeSizes ? SHOE_SIZE_OPTIONS : SIZE_OPTIONS;

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (form.sizes.length === 0) {
      setError('Debes seleccionar al menos una talla');
      setSaving(false);
      return;
    }

    const slug = form.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'producto';

    const colorsArray = form.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const tagsArray = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const catSlug = categories.find(c => String(c.id) === form.cat)?.slug || '';
    const subcatName = subcategories.find(s => String(s.id) === form.subcat)?.name || '';

    const data: Record<string, any> = {
      name: form.name,
      slug,
      price: parseFloat(form.price),
      category: catSlug,
      subcategory: subcatName,
      category_id: form.cat ? parseInt(form.cat) : null,
      subcategory_id: form.subcat ? parseInt(form.subcat) : null,
      brand_id: form.brand ? parseInt(form.brand) : null,
      description: form.description,
      sizes: form.sizes,
      featured: form.featured,
      whatsapp: SITE_CONFIG.whatsapp,
      availability: form.availability,
      newArrival: form.newArrival,
      onSale: form.onSale,
      sku: form.sku || undefined,
      colors: colorsArray.length > 0 ? colorsArray : undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      images: form.images,
    };

    if (form.oldPrice && form.onSale) {
      data.oldPrice = parseFloat(form.oldPrice);
    }

    const body = { data };

    try {
      const url = isEditing
        ? `/api/admin/products/${initialData?.id}`
        : '/api/admin/products';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al guardar');
      }

      setSuccess(isEditing ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Nombre del producto *</label>
          <input type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
            placeholder="Ej: Vestido Floral Verano" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Precio (Q) *</label>
          <input type="number" step="0.01" min="0" required value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
            placeholder="299.99" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Categoría *</label>
          <select required value={form.cat}
            onChange={(e) => { updateField('cat', e.target.value); updateField('subcat', ''); }}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}>
            <option value="">Seleccionar...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Subcategoría *</label>
          <select required value={form.subcat} onChange={(e) => updateField('subcat', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}>
            <option value="">Seleccionar...</option>
            {filteredSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Marca</label>
          <select value={form.brand} onChange={(e) => updateField('brand', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}>
            <option value="">Sin marca</option>
            {brands.filter(b => b.name).map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>SKU</label>
          <input type="text" value={form.sku} onChange={(e) => updateField('sku', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
            placeholder="Ej: EB-MUJ-001" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Disponibilidad</label>
          <select value={form.availability} onChange={(e) => updateField('availability', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}>
            <option value="available">Disponible</option>
            <option value="low_stock">Últimas unidades</option>
            <option value="out_of_stock">Agotado</option>
            <option value="pre_order">Bajo pedido</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Colores (separados por coma)</label>
          <input type="text" value={form.colors} onChange={(e) => updateField('colors', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
            placeholder="Negro, Blanco, Rojo" />
        </div>
      </div>

      {form.onSale && (
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Precio anterior (Q) — antes de la oferta</label>
          <input type="number" step="0.01" min="0" value={form.oldPrice}
            onChange={(e) => updateField('oldPrice', e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors max-w-xs"
            style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
            placeholder="399.99" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Tags (separados por coma)</label>
        <input type="text" value={form.tags} onChange={(e) => updateField('tags', e.target.value)}
          className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors"
          style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
          placeholder="nueva colección, primavera, floral" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Descripción</label>
        <textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)}
          className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors resize-none"
          style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
          placeholder="Describe el producto..." />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#44403c' }}>
          Tallas disponibles *
        </label>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button key={size} type="button" onClick={() => toggleSize(size)}
              className="px-4 py-2 border rounded-lg text-sm font-medium transition-all"
              style={{
                borderColor: form.sizes.includes(size) ? '#1c1917' : '#d6d3d1',
                backgroundColor: form.sizes.includes(size) ? '#1c1917' : '#ffffff',
                color: form.sizes.includes(size) ? '#ffffff' : '#44403c',
              }}>
              {size}
            </button>
          ))}
        </div>
        {form.sizes.length === 0 && (
          <p className="text-xs mt-1" style={{ color: '#a8a29e' }}>Selecciona al menos una talla</p>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
            className="w-5 h-5 rounded" style={{ borderColor: '#d6d3d1' }} />
          <span className="text-sm font-medium" style={{ color: '#44403c' }}>Destacado</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.newArrival}
            onChange={(e) => updateField('newArrival', e.target.checked)}
            className="w-5 h-5 rounded" style={{ borderColor: '#d6d3d1' }} />
          <span className="text-sm font-medium" style={{ color: '#44403c' }}>Nuevo Ingreso</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.onSale}
            onChange={(e) => { updateField('onSale', e.target.checked); if (!e.target.checked) updateField('oldPrice', ''); }}
            className="w-5 h-5 rounded" style={{ borderColor: '#d6d3d1' }} />
          <span className="text-sm font-medium" style={{ color: '#44403c' }}>En Oferta</span>
        </label>
      </div>

      <ImageUpload
        existingImages={form.images.map((img) => ({ id: img.id, url: img.url }))}
        onImagesChange={(images) => updateField('images', images)}
      />

      <div className="flex gap-4 pt-4 border-t" style={{ borderColor: '#e5e0d8' }}>
        <button type="submit" disabled={saving}
          className="px-8 py-3 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
          {saving ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
        <button type="button" onClick={() => router.push('/admin')}
          className="px-8 py-3 border font-medium rounded-lg transition-colors"
          style={{ borderColor: '#d6d3d1', color: '#44403c' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
