'use client';

export default function CatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#faf7f2' }}>
      <div className="text-center max-w-md">
        <p className="text-lg font-semibold" style={{ color: '#991b1b' }}>Algo salió mal</p>
        <p className="text-sm mt-2" style={{ color: '#57534e' }}>
          {error.message || 'No pudimos cargar esta página. Intenta de nuevo.'}
        </p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
