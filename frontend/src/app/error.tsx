'use client';
import { BRAND_COLORS } from '@/lib/config';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.background }}>
      <div className="text-center px-4">
        <h2 className="text-2xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>Algo salió mal</h2>
        <p className="mb-8" style={{ color: BRAND_COLORS.textMuted }}>Ocurrió un error inesperado. Intenta de nuevo.</p>
        <button onClick={reset} className="px-8 py-3 font-semibold rounded-full transition-all" style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}>
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
