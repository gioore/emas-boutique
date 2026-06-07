'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <p className="text-lg font-semibold" style={{ color: '#991b1b' }}>Error en el administrador</p>
      <p className="text-sm mt-2" style={{ color: '#57534e' }}>
        {error.message || 'Ocurrió un error inesperado'}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
      >
        Reintentar
      </button>
    </div>
  );
}
