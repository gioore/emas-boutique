import { Suspense } from 'react';
import CatalogView from '@/components/catalog/CatalogView';
import { getCatalogData } from '@/lib/catalog';
import { BRAND_COLORS } from '@/lib/config';

export const revalidate = 60;

export default async function HombrePage() {
  const catalog = await getCatalogData('hombre');

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.white }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.primary, borderTopColor: 'transparent' }} />
      </div>
    }>
      <CatalogView
        mode="hombre"
        title="Hombre"
        subtitle="Camisas, playeras, pantalones y accesorios importados"
        products={catalog.products}
        brands={catalog.brands}
        categories={catalog.categories}
        error={catalog.error}
      />
    </Suspense>
  );
}
