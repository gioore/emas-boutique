import BrandForm from '@/components/admin/BrandForm';

export default function NuevaMarcaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Nueva Marca</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Registra una nueva marca de productos</p>
      </div>

      <div className="rounded-xl border p-6 max-w-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <BrandForm />
      </div>
    </div>
  );
}
