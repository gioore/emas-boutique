import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/queries';
import { getImageUrl } from '@/lib/images';
import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format-product';
import { SITE_CONFIG, SITE_URL, BRAND_COLORS } from '@/lib/config';
import ProductCard from '@/components/ProductCard';
import ShareButton from '@/components/ShareButton';
import ProductBuyClient from '@/components/ProductBuyClient';
import ProductImageGallery from '@/components/ProductImageGallery';
import type { Product } from '@/types/product';

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .replace(/href='javascript:[^']*'/gi, "href='#'");
}

const AVAILABILITY_LABELS: Record<string, string> = {
  available: 'Disponible',
  low_stock: 'Últimas unidades',
  out_of_stock: 'Agotado',
  pre_order: 'Bajo pedido',
};

const AVAILABILITY_COLORS: Record<string, string> = {
  available: '#4a7c59',
  low_stock: '#a16244',
  out_of_stock: '#991b1b',
  pre_order: '#6b6b8a',
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
        url: `${SITE_URL}/producto/${slug}`,
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
      `SELECT p.*, b.id as brand_id, b.name as brand_name, b.slug as brand_slug,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
        sc.id as subcat_id, sc.name as subcat_name, sc.slug as subcat_slug
       FROM products p
       LEFT JOIN brands b ON b.id = p.brand_id
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
       WHERE p.subcategory_id = $1 AND p.id != $2
       ORDER BY p.created_at DESC LIMIT 4`,
      [product.subcat.id, product.id]
    );
    return rows.map(formatProduct) as Product[];
  } catch {
    return [];
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  let product: Product;
  try {
    const result = await getProduct(slug);
    product = result.data;
  } catch (err) {
    if (err instanceof Error && err.message === 'Product not found') notFound();
    throw err;
  }

  const relatedProducts = await fetchRelated(product);
  const colors: string[] = Array.isArray(product.colors) ? product.colors : [];

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
          <ProductImageGallery
            images={product.images || []}
            productName={product.name}
            onSale={!!product.onSale}
            newArrival={!!product.newArrival}
          />

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
                  <p className="text-3xl font-bold" style={{ color: '#991b1b' }}>
                    Q{product.price.toFixed(2)}
                  </p>
                  <p className="text-xl line-through" style={{ color: BRAND_COLORS.textMuted }}>
                    Q{product.oldPrice.toFixed(2)}
                  </p>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: '#f5f0e8', color: '#991b1b' }}>
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
              <p className="text-xs mt-2" style={{ color: BRAND_COLORS.textMuted }}>
                SKU: {product.sku}
              </p>
            )}

            <div className="w-12 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: BRAND_COLORS.text }}>
                  Descripción
                </h3>
                <div
                  className="text-sm leading-relaxed prose prose-sm max-w-none"
                  style={{ color: BRAND_COLORS.textMuted }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>
            )}

            <div className="mb-6">
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
              colors={colors}
            />

            <div className="flex items-center gap-4 mt-6">
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
