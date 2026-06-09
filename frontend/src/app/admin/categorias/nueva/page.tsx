import Link from 'next/link';
import CategoryForm from '@/components/admin/CategoryForm';

export default function NuevaCategoriaPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/categorias" className="inline-flex items-center gap-1 text-sm font-medium mb-2 transition-colors" style={{ color: '#78716c' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver a Categorías
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Nueva Categoría</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Registra una nueva categoría de productos</p>
      </div>

      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <CategoryForm />
      </div>
    </div>
  );
}
