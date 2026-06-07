import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/queries';
import { getImageUrl } from '@/lib/images';
import { query } from '@/lib/db';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import ProductCard from '@/components/ProductCard';
import ShareButton from '@/components/ShareButton';
import ProductBuyClient from '@/components/ProductBuyClient';
import type { Product } from '@/types/product';

const AVAILABILITY_LABELS: Record<string, string> = {
  available: 'Disponible',
  low_stock: 'Últimas unidades',
  out_of_stock: 'Agotado',
  pre_order: 'Bajo pedido',
};

const AVAILABILITY_COLORS: Record<string, string> = {
  available: '#166534',
  low_stock: '#92400e',
  out_of_stock: '#991b1b',
  pre_order: '#1e40af',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { data: product } = await getProduct(slug);
    const images = product.images?.[0] ? [getImageUrl(product.images[0])] : [];
    const description = product.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Compra ${product.name} por Q${product.price.toFixed(2)}`;
    return {
      title: `${product.name} - ${SITE_CONFIG.name}`,
      description,
      openGraph: {
        title: `${product.name} - ${SITE_CONFIG.name}`,
        description,
        url: `https://emasboutique.com/producto/${slug}`,
        images: images.length > 0 ? [{ url: images[0], width: 1200, height: 1600, alt: product.name }] : [],
        locale: 'es_GT',
        siteName: SITE_CONFIG.name,
        type: 'website',
      },
    };
  } catch {
    return { title: `Producto no encontrado - ${SITE_CONFIG.name}` };
  }
}

async function fetchRelated(product: Product): Promise<Product[]> {
  if (!product.subcat?.id) return [];
  try {
    const rows = await query(
      `SELECT * FROM products WHERE subcategory_id = $1 AND id != $2 ORDER BY created_at DESC LIMIT 4`,
      [product.subcat.id, product.id]
    );
    return rows.map(formatProduct) as Product[];
  } catch {
    return [];
  }
}

function formatProduct(p: any): any {
  return {
    id: p.id, name: p.name, slug: p.slug, price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : null,
    category: p.category || '', subcategory: p.subcategory || '',
    description: p.description || '', sizes: p.sizes || [],
    images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
    featured: !!p.featured, sku: p.sku || null,
    availability: p.availability || 'available',
    newArrival: !!p.new_arrival, onSale: !!p.on_sale,
    colors: p.colors || [], tags: p.tags || [],
    createdAt: p.created_at, updatedAt: p.updated_at,
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  let product: Product;
  try {
    const result = await getProduct(slug);
    product = result.data;
  } catch {
    notFound();
  }

  const relatedProducts = await fetchRelated(product);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            description: product.description?.replace(/<[^>]*>/g, '').slice(0, 200),
            image: product.images?.[0] ? getImageUrl(product.images[0]) : undefined,
            brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "GTQ",
              availability: product.availability === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            },
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: BRAND_COLORS.textMuted }}>
            <li>
              <Link href="/" className="hover:text-[#1c1917] transition-colors">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/catalogo" className="hover:text-[#1c1917] transition-colors">Catálogo</Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={product.cat?.name?.toLowerCase() === 'mujer' ? '/mujer' : product.cat?.name?.toLowerCase() === 'hombre' ? '/hombre' : '#'}
                className="hover:text-[#1c1917] transition-colors capitalize"
              >
                {product.cat?.name || product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium truncate" style={{ color: BRAND_COLORS.text }}>{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg" style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}>
              {product.images?.[0] ? (
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#d6d3d1' }}>
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {product.onSale && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
                    OFERTA
                  </span>
                )}
                {product.newArrival && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: BRAND_COLORS.gold, color: '#ffffff' }}>
                    Nuevo Ingreso
                  </span>
                )}
                {!product.onSale && !product.newArrival && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: BRAND_COLORS.gold, color: '#ffffff' }}>
                    100% Original
                  </span>
                )}
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors"
                    style={{ borderColor: i === 0 ? BRAND_COLORS.primary : '#e5e0d8' }}
                  >
                    {img.url && (
                      <Image
                        src={getImageUrl(img)}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {product.brand && (
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>
                {product.brand.name}
              </span>
            )}
            {product.subcat?.name && (
              <span className="text-xs uppercase tracking-[0.2em] font-medium mt-2" style={{ color: BRAND_COLORS.textMuted }}>
                {product.subcat.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold mt-3 leading-tight" style={{ color: BRAND_COLORS.text }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-6">
              {product.onSale && product.oldPrice ? (
                <>
                  <p className="text-3xl font-bold" style={{ color: '#dc2626' }}>
                    Q{product.price.toFixed(2)}
                  </p>
                  <p className="text-xl line-through" style={{ color: '#a8a29e' }}>
                    Q{product.oldPrice.toFixed(2)}
                  </p>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              ) : (
                <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.text }}>
                  Q{product.price.toFixed(2)}
                </p>
              )}
            </div>

            {product.availability && (
              <div className="mt-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: AVAILABILITY_COLORS[product.availability] + '15',
                    color: AVAILABILITY_COLORS[product.availability],
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: AVAILABILITY_COLORS[product.availability] }}
                  />
                  {AVAILABILITY_LABELS[product.availability]}
                </span>
              </div>
            )}

            {product.sku && (
              <p className="text-xs mt-2" style={{ color: '#a8a29e' }}>
                SKU: {product.sku}
              </p>
            )}

            <div className="w-12 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: BRAND_COLORS.text }}>
                  Colores disponibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 border rounded-lg text-xs font-medium"
                      style={{ borderColor: '#d6d3d1', color: BRAND_COLORS.text, backgroundColor: BRAND_COLORS.white }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: BRAND_COLORS.text }}>
                  Descripción
                </h3>
                <div
                  className="text-sm leading-relaxed prose prose-sm max-w-none"
                  style={{ color: BRAND_COLORS.textMuted }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/guia-de-tallas"
                className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                style={{ color: BRAND_COLORS.textMuted }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Guía de tallas
              </Link>
            </div>

            <ProductBuyClient
              productName={product.name}
              productPrice={product.price}
              sizes={product.sizes || []}
            />

            <div className="flex items-center gap-4 mt-4">
              <ShareButton title={product.name} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t" style={{ borderColor: '#e5e0d8' }}>
            <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND_COLORS.text }}>Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
