import CategoryForm from '@/components/admin/CategoryForm';

export default function NuevaCategoriaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Nueva Categoría</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Registra una nueva categoría de productos</p>
      </div>

      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <CategoryForm />
      </div>
    </div>
  );
}
