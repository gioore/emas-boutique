import { Suspense } from 'react';
import CatalogView from '@/components/catalog/CatalogView';
import { getCatalogData } from '@/lib/catalog';
import { BRAND_COLORS } from '@/lib/config';

export const revalidate = 60;

function CatalogFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.background }}>
      <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.primary, borderTopColor: 'transparent' }} />
    </div>
  );
}

export default async function CatalogoPage() {
  const catalog = await getCatalogData('all');

  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView
        mode="all"
        title="Catalogo"
        subtitle="Explora todos nuestros productos importados"
        products={catalog.products}
        brands={catalog.brands}
        categories={catalog.categories}
        error={catalog.error}
      />
    </Suspense>
  );
}
