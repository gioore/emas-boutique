'use client';

import ErrorFallback from '@/components/ErrorFallback';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      title="Error en el administrador"
      message={error.message || 'Ocurrió un error inesperado'}
      onReset={reset}
      fullPage={false}
      bgColor="#ffffff"
    />
  );
}
