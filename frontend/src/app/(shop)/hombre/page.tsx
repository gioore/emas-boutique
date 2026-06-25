import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogView from '@/components/catalog/CatalogView';
import { getCatalogData } from '@/lib/catalog';
import { BRAND_COLORS } from '@/lib/config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ropa para Hombre | EMAS Boutique',
  description: 'Camisas, playeras, pantalones, chamarras y accesorios para hombre. Moda original en Guatemala.',
  openGraph: {
    title: 'Hombre - EMAS Boutique',
    description: 'Descubre nuestra colección de moda masculina.',
  },
};

export default async function HombrePage() {
  const catalog = await getCatalogData('hombre');

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.white }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.text, borderTopColor: 'transparent' }} />
      </div>
    }>
      <CatalogView
        mode="hombre"
        title="Hombre"
        subtitle="Camisas, playeras, pantalones y accesorios"
        products={catalog.products}
        brands={catalog.brands}
        categories={catalog.categories}
        error={catalog.error}
      />
    </Suspense>
  );
}
