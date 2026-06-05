import ProductForm from '@/components/admin/ProductForm';

export default function NuevoProductoPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Nuevo Producto</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Completa los campos para agregar un nuevo producto</p>
      </div>

      <div className="rounded-xl border p-6 max-w-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <ProductForm />
      </div>
    </div>
  );
}
