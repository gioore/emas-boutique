import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getFeaturedProducts, getNewArrivals, getOnSaleProducts, getBrands } from "@/lib/strapi";
import { BRAND_COLORS, SITE_CONFIG } from "@/lib/config";

export default async function Home() {
  let featured: import('@/types/product').Product[] = [];
  let newArrivals: import('@/types/product').Product[] = [];
  let onSale: import('@/types/product').Product[] = [];
  let brands: import('@/types/brand').Brand[] = [];
  try {
    [featured, newArrivals, onSale, brands] = await Promise.all([
      getFeaturedProducts(),
      getNewArrivals(),
      getOnSaleProducts(),
      getBrands(),
    ]);
  } catch {}

  return (
    <>
      <Hero />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
                Lo más nuevo
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>
                Nuevos Ingresos
              </h2>
              <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: BRAND_COLORS.gold }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/catalogo?sort=newest"
                className="inline-flex px-8 py-3 text-sm font-semibold rounded-full transition-all hover:scale-105"
                style={{ border: `2px solid ${BRAND_COLORS.primary}`, color: BRAND_COLORS.primary }}
              >
                Ver todos los nuevos ingresos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
              Categorías
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>
              Explora por categoría
            </h2>
            <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: BRAND_COLORS.gold }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/mujer"
              className="relative h-[400px] rounded-2xl overflow-hidden group block"
            >
              <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(199,111,75,0.3) 0%, rgba(0,0,0,0.5) 100%)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('/brand/mujer-hero.svg')", backgroundColor: BRAND_COLORS.backgroundAlt }} />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-3xl font-bold text-white mb-2">Mujer</h3>
                <p className="text-zinc-200 text-sm">Vestidos, blusas, pantalones y más</p>
              </div>
            </Link>

            <Link
              href="/hombre"
              className="relative h-[400px] rounded-2xl overflow-hidden group block"
            >
              <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(199,111,75,0.3) 0%, rgba(0,0,0,0.5) 100%)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('/brand/hombre-hero.svg')", backgroundColor: BRAND_COLORS.backgroundAlt }} />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-3xl font-bold text-white mb-2">Hombre</h3>
                <p className="text-zinc-200 text-sm">Camisas, playeras, pantalones y más</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="py-20" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
                No te lo pierdas
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>
                Ofertas Especiales
              </h2>
              <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: BRAND_COLORS.gold }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {onSale.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/catalogo?sort=price-asc"
                className="inline-flex px-8 py-3 text-sm font-semibold rounded-full transition-all hover:scale-105"
                style={{ border: `2px solid ${BRAND_COLORS.primary}`, color: BRAND_COLORS.primary }}
              >
                Ver todas las ofertas
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.filter(b => b.active !== false).length > 0 && (
        <section className="py-16" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
                Marcas
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>
                Marcas que trabajamos
              </h2>
              <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: BRAND_COLORS.gold }} />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {brands.filter(b => b.active !== false).map((brand) => (
                <Link
                  key={brand.documentId}
                  href={`/catalogo?marca=${brand.documentId}`}
                  className="px-8 py-4 rounded-xl border text-sm font-semibold transition-all hover:scale-105 hover:shadow-md"
                  style={{ backgroundColor: BRAND_COLORS.white, borderColor: '#e5e0d8', color: BRAND_COLORS.text }}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-20" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
                Destacados
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>
                Productos Destacados
              </h2>
              <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: BRAND_COLORS.gold }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram */}
      <section className="py-16" style={{ backgroundColor: BRAND_COLORS.white }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: BRAND_COLORS.gold }} />
            <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
              Síguenos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>
              @{SITE_CONFIG.instagram}
            </h2>
            <p className="mt-3 text-base max-w-md mx-auto" style={{ color: BRAND_COLORS.textMuted }}>
              Descubre nuestras últimas novedades, promociones y contenido exclusivo en Instagram.
            </p>
            <a
              href={`https://instagram.com/${SITE_CONFIG.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 px-8 py-3.5 text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-md"
              style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#ffffff' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Seguir en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: BRAND_COLORS.text }}>
            ¿Lista para renovar tu guardarropa?
          </h2>
          <p className="mb-10 max-w-lg mx-auto text-lg" style={{ color: BRAND_COLORS.textMuted }}>
            Mercadería importada 100% original. Entregas inmediatas y bajo pedido con envíos a toda Guatemala.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/catalogo"
              className="px-10 py-4 text-white font-semibold rounded-full hover:scale-105 transition-all duration-200 shadow-xl"
              style={{ backgroundColor: BRAND_COLORS.primary }}
            >
              Ver Catálogo Completo
            </Link>
            <Link
              href="/mujer"
              className="px-10 py-4 font-semibold rounded-full hover:scale-105 transition-all duration-200"
              style={{ border: `2px solid ${BRAND_COLORS.primary}`, color: BRAND_COLORS.primary }}
            >
              Ver Mujer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
