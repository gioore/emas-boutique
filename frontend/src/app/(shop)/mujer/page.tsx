import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogView from '@/components/catalog/CatalogView';
import { getCatalogData } from '@/lib/catalog';
import { BRAND_COLORS } from '@/lib/config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ropa para Mujer | EMAS Boutique',
  description: 'Vestidos, blusas, pantalones, faldas y accesorios para mujer. Las mejores marcas originales en Guatemala.',
  openGraph: {
    title: 'Mujer - EMAS Boutique',
    description: 'Descubre nuestra colección de moda femenina.',
  },
};

export default async function MujerPage() {
  const catalog = await getCatalogData('mujer');

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.white }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.primary, borderTopColor: 'transparent' }} />
      </div>
    }>
      <CatalogView
        mode="mujer"
        title="Mujer"
        subtitle="Vestidos, blusas, pantalones y accesorios"
        products={catalog.products}
        brands={catalog.brands}
        categories={catalog.categories}
        error={catalog.error}
      />
    </Suspense>
  );
}
