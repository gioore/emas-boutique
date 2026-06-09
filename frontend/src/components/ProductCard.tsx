'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/images';
import { BRAND_COLORS, SITE_CONFIG } from '@/lib/config';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasTwoImages = product.images && product.images.length >= 2;
  const imageUrl = product.images?.[imgIndex] ? getImageUrl(product.images[imgIndex]) : '/placeholder.svg';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e5e0d8' }}
      onMouseEnter={() => hasTwoImages && setImgIndex(1)}
      onMouseLeave={() => setImgIndex(0)}
    >
      <Link href={`/producto/${product.slug}`} scroll={false}>
        <div className="aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: '#f5f0e8' }}>
          {product.images?.[imgIndex] ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#d6d3d1' }}>
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.onSale && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: BRAND_COLORS.terracotta, color: '#ffffff' }}>
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
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>
            {product.brand.name}
          </span>
        )}
        <span className="text-xs uppercase tracking-wider font-medium mt-1" style={{ color: BRAND_COLORS.textMuted }}>
          {product.subcat?.name || product.subcategory}
        </span>
        <Link href={`/producto/${product.slug}`} scroll={false}>
          <h3 className="text-sm font-semibold mt-1.5 leading-snug transition-colors duration-300 hover:text-[#d4a373]" style={{ color: '#1c1917' }}>
            {product.name}
          </h3>
        </Link>
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
        <div className="mt-auto pt-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {product.onSale && product.oldPrice ? (
              <>
                <p className="text-base font-bold" style={{ color: '#991b1b' }}>
                  Q{product.price.toFixed(2)}
                </p>
                <p className="text-sm line-through" style={{ color: BRAND_COLORS.textMuted }}>
                  Q{product.oldPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-base font-bold" style={{ color: '#1c1917' }}>
                Q{product.price.toFixed(2)}
              </p>
            )}
          </div>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappProductMessage(product.name, product.price))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#25D366', color: '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
