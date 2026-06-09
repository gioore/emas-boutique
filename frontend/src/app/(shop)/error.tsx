'use client';

import ErrorFallback from '@/components/ErrorFallback';

export default function CatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      title="Algo salió mal"
      message={error.message || 'No pudimos cargar esta página. Intenta de nuevo.'}
      onReset={reset}
    />
  );
}
