import Link from 'next/link';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.background }}>
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold mb-4" style={{ color: BRAND_COLORS.gold }}>404</h1>
        <h2 className="text-2xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>Página no encontrada</h2>
        <p className="mb-8 max-w-md mx-auto" style={{ color: BRAND_COLORS.textMuted }}>
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="px-8 py-3 font-semibold rounded-full transition-all" style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}>
            Ir al Inicio
          </Link>
          <Link href="/catalogo" className="px-8 py-3 font-semibold rounded-full transition-all border" style={{ borderColor: BRAND_COLORS.primary, color: BRAND_COLORS.primary }}>
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
