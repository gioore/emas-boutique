'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/images';
import { BRAND_COLORS, SITE_CONFIG } from '@/lib/config';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const imageUrl = product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder.svg';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #e5e0d8',
      }}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="aspect-[3/4] relative overflow-hidden block"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        {product.images?.[0] ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#d6d3d1' }}>
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10"
          style={{ backgroundColor: 'rgba(28,25,23,0.6)' }}
        >
          <div className="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span
              className="px-6 py-2.5 text-xs font-semibold rounded-full transition-all hover:scale-105 text-center"
              style={{ backgroundColor: '#d4a373', color: '#1c1917' }}
            >
              Ver Detalle
            </span>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappProductMessage(product.name, product.price))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 text-xs font-semibold rounded-full transition-all hover:scale-105 text-center"
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              onClick={(e) => e.stopPropagation()}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.onSale && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
              OFERTA
            </span>
          )}
          {product.newArrival && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: BRAND_COLORS.gold, color: '#ffffff' }}>
              Nuevo
            </span>
          )}
          {!product.onSale && !product.newArrival && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: 'rgba(212,163,115,0.9)', color: '#ffffff' }}>
              100% Original
            </span>
          )}
          {product.availability === 'out_of_stock' && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
              Agotado
            </span>
          )}
        </div>
      </Link>

      <Link href={`/producto/${product.slug}`} className="p-5 flex flex-col flex-1">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>
            {product.brand.name}
          </span>
        )}
        <span className="text-xs uppercase tracking-wider font-medium mt-1" style={{ color: '#a8a29e' }}>
          {product.subcat?.name || product.subcategory}
        </span>
        <h3
          className="text-sm font-semibold mt-1.5 leading-snug transition-colors duration-300 group-hover:text-[#d4a373]"
          style={{ color: '#1c1917' }}
        >
          {product.name}
        </h3>
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.slice(0, 4).map((size) => (
              <span key={size} className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#f5f0e8', color: '#78716c' }}>
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#f5f0e8', color: '#78716c' }}>
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center gap-2">
          {product.onSale && product.oldPrice ? (
            <>
              <p className="text-base font-bold" style={{ color: '#dc2626' }}>
                Q{product.price.toFixed(2)}
              </p>
              <p className="text-sm line-through" style={{ color: '#a8a29e' }}>
                Q{product.oldPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-base font-bold" style={{ color: '#1c1917' }}>
              Q{product.price.toFixed(2)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
