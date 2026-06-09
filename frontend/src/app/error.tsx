'use client';
import ErrorFallback from '@/components/ErrorFallback';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback onReset={reset} />;
}
