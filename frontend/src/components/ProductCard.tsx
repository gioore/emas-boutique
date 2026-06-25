'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/lib/images';
import { BRAND_COLORS } from '@/lib/config';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasTwoImages = product.images && product.images.length >= 2;
  const imageUrl = product.images?.[imgIndex] ? getOptimizedImageUrl(product.images[imgIndex], 400) : '/placeholder.svg';

  return (
    <Link
      href={`/producto/${product.slug}`}
      scroll={false}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e5e5e5' }}
      onMouseEnter={() => hasTwoImages && setImgIndex(1)}
      onMouseLeave={() => setImgIndex(0)}
    >
      <div className="aspect-[3/4] relative overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
        {product.images?.[imgIndex] ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#d6d3d1' }}>
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.onSale && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: BRAND_COLORS.terracotta, color: '#ffffff' }}>
              OFERTA
            </span>
          )}
          {product.newArrival && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: BRAND_COLORS.black, color: '#ffffff' }}>
              Nuevo
            </span>
          )}
          {!product.onSale && !product.newArrival && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
              100% Original
            </span>
          )}
          {product.availability === 'out_of_stock' && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#666666', color: '#ffffff' }}>
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: BRAND_COLORS.textMuted }}>
            {product.brand.name}
          </span>
        )}
        <span className="text-xs uppercase tracking-wider font-medium mt-1" style={{ color: BRAND_COLORS.textMuted }}>
          {product.subcat?.name || product.subcategory}
        </span>
        <h3 className="text-sm font-semibold mt-1.5 leading-snug transition-colors duration-300 group-hover:text-black" style={{ color: '#000000' }}>
          {product.name}
        </h3>
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.slice(0, 4).map((size) => (
              <span key={size} className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#f5f5f5', color: '#78716c' }}>
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#f5f5f5', color: '#78716c' }}>
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
              <p className="text-sm line-through" style={{ color: BRAND_COLORS.textMuted }}>
                Q{product.oldPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-base font-bold" style={{ color: '#000000' }}>
              Q{product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
