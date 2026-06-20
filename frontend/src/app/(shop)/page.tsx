import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Link from "next/link";
import { getFeaturedProducts, getNewArrivals, getOnSaleProducts, getBrands } from "@/lib/queries";
import { BRAND_COLORS, SITE_CONFIG, WHY_EMAS, TESTIMONIALS } from "@/lib/config";
import type { Product } from "@/types/product";
import type { Brand } from "@/types/product";

function SectionLabel({ text }: { text: string }) {
  return <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>{text}</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl sm:text-4xl font-bold mt-3" style={{ color: BRAND_COLORS.text }}>{children}</h2>;
}

function GoldDivider() {
  return <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: BRAND_COLORS.gold }} />;
}

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex px-8 py-3 text-sm font-semibold rounded-full transition-all hover:scale-105"
      style={{ border: `2px solid ${BRAND_COLORS.primary}`, color: BRAND_COLORS.primary }}
    >
      {label}
    </Link>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <SectionLabel text={label} />
      <SectionTitle>{title}</SectionTitle>
      <GoldDivider />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featured: Product[] = [];
  let newArrivals: Product[] = [];
  let onSale: Product[] = [];
  let brands: Brand[] = [];
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

      {/* Stats Bar */}
      <section className="py-12" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.gold }}>5+</p>
              <p className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: BRAND_COLORS.textMuted }}>Años de experiencia</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.gold }}>{featured.length + newArrivals.length + onSale.length || '100'}+</p>
              <p className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: BRAND_COLORS.textMuted }}>Productos importados</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.gold }}>{brands.length}+</p>
              <p className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: BRAND_COLORS.textMuted }}>Marcas originales</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.gold }}>🇬🇹</p>
              <p className="text-xs uppercase tracking-wider mt-1 font-medium" style={{ color: BRAND_COLORS.textMuted }}>Envíos a todo GT</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Lo más nuevo" title="Nuevos Ingresos" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <ViewAllLink href="/catalogo?sort=newest" label="Ver todos los nuevos ingresos" />
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Categorías" title="Explora por categoría" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/mujer"
              className="relative h-[450px] rounded-2xl overflow-hidden group block shadow-lg hover:shadow-2xl transition-shadow duration-500"
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
              className="relative h-[450px] rounded-2xl overflow-hidden group block shadow-lg hover:shadow-2xl transition-shadow duration-500"
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

      {/* Why EMAS */}
      <section className="py-20" style={{ backgroundColor: BRAND_COLORS.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Por qué nosotras" title="¿Por qué EMAS Boutique?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {WHY_EMAS.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid #e5e0d8` }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(212,163,115,0.15)' }}>
                  {item.icon === 'shield' && (
                    <svg className="w-8 h-8" style={{ color: BRAND_COLORS.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {item.icon === 'chat' && (
                    <svg className="w-8 h-8" style={{ color: BRAND_COLORS.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                  {item.icon === 'truck' && (
                    <svg className="w-8 h-8" style={{ color: BRAND_COLORS.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_COLORS.text }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="py-20" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="No te lo pierdas" title="Ofertas Especiales" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {onSale.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <ViewAllLink href="/catalogo?sort=price-asc" label="Ver todas las ofertas" />
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.filter(b => b.active !== false).length > 0 && (
        <section className="py-16" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Marcas" title="Marcas que trabajamos" />
            <div className="flex flex-wrap justify-center gap-4">
              {brands.filter(b => b.active !== false).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogo?marca=${brand.id}`}
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

      {/* Testimonials */}
      <section className="py-20" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Testimonios" title="Lo que dicen nuestras clientas" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid #e5e0d8` }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4" style={{ color: BRAND_COLORS.gold }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: BRAND_COLORS.textMuted }}>"{t.text}"</p>
                <p className="text-sm font-semibold" style={{ color: BRAND_COLORS.text }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-20" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Destacados" title="Productos Destacados" />
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
          <div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <SectionLabel text="Síguenos" />
          <SectionTitle>@{SITE_CONFIG.instagram}</SectionTitle>
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
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #1c1917 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: BRAND_COLORS.text }}>
            ¿Lista para renovar tu guardarropa?
          </h2>
          <p className="mb-10 max-w-lg mx-auto text-lg" style={{ color: BRAND_COLORS.textMuted }}>
            Mercadería importada 100% original. Entregas inmediatas y bajo pedido con envíos a toda Guatemala.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/catalogo"
              className="group relative overflow-hidden px-10 py-4 text-white font-semibold rounded-full transition-all duration-300 shadow-xl inline-flex items-center gap-2"
              style={{ backgroundColor: BRAND_COLORS.primary }}
            >
              <span className="relative z-10">Ver Catálogo Completo</span>
              <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-4 font-semibold rounded-full transition-all duration-300 inline-flex items-center gap-2"
              style={{ border: `2px solid ${BRAND_COLORS.primary}`, color: BRAND_COLORS.primary }}
            >
              <WhatsAppIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
