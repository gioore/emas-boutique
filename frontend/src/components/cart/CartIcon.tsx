'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      className="flex items-center gap-1.5 text-sm font-medium transition-colors"
      style={{ color: '#000000' }}
      aria-label={`Carrito de compras${totalItems > 0 ? ` (${totalItems} productos)` : ''}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span>({totalItems})</span>
    </Link>
  );
}
