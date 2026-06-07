'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

interface EditProduct {
  id: number;
  name: string;
  price: string;
  cat: string;
  subcat: string;
  brand: string;
  description: string;
  sizes: string[];
  featured: boolean;
  newArrival: boolean;
  onSale: boolean;
  colors: string;
  tags: string;
  availability: string;
  sku: string;
  oldPrice: string;
  images: { id: number; url: string }[];
}

export default function EditarProductoPage() {
  const params = useParams();
  const [product, setProduct] = useState<EditProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        const found = (data.data ?? []).find((p: { id: number }) => String(p.id) === params.id);
        if (found) {
          setProduct({
            id: found.id,
            name: found.name,
            price: found.price.toString(),
            cat: found.category_id?.toString() || '',
            subcat: found.subcategory_id?.toString() || '',
            brand: found.brand_id?.toString() || '',
            description: found.description || '',
            sizes: found.sizes || [],
            featured: found.featured,
            newArrival: found.new_arrival,
            onSale: found.on_sale,
            colors: Array.isArray(found.colors) ? found.colors.join(', ') : found.colors || '',
            tags: Array.isArray(found.tags) ? found.tags.join(', ') : found.tags || '',
            availability: found.availability || 'available',
            sku: found.sku || '',
            oldPrice: found.old_price?.toString() || '',
            images: found.images || [],
          });
        } else {
          setError('Producto no encontrado');
        }
      } catch {
        setError('Error al cargar producto');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
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
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Editar Producto</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Modifica los campos del producto</p>
      </div>
      <div className="rounded-xl border p-6 max-w-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <ProductForm initialData={product ?? undefined} isEditing />
      </div>
    </div>
  );
}
