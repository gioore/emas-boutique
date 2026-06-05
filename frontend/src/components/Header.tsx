'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/mujer', label: 'Mujer' },
  { href: '/hombre', label: 'Hombre' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(250,247,242,0.95)', backdropFilter: 'blur-sm', borderColor: '#e5e0d8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}>
              EB
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: BRAND_COLORS.text }}>
              {SITE_CONFIG.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.href) ? BRAND_COLORS.text : BRAND_COLORS.textMuted,
                  borderBottom: isActive(link.href) ? `2px solid ${BRAND_COLORS.gold}` : '2px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" style={{ color: BRAND_COLORS.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t pt-4" style={{ borderColor: '#e5e0d8' }}>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium"
                  style={{ color: isActive(link.href) ? BRAND_COLORS.text : BRAND_COLORS.textMuted }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
