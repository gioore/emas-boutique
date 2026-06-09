'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/mujer', label: 'Mujer' },
  { href: '/hombre', label: 'Hombre' },
];

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const megaTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', menuOpen);
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [menuOpen]);

  useEffect(() => {
    fetch('/api/public/categories')
      .then((r) => r.json())
      .then((json) => { if (json.data) setCategories(json.data); })
      .catch(() => {});
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleMegaEnter = (slug: string) => {
    clearTimeout(megaTimer.current);
    setMegaOpen(slug);
  };

  const handleMegaLeave = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(null), 150);
  };

  const mujerCats = categories.filter((c) => c.slug === 'mujer');
  const hombreCats = categories.filter((c) => c.slug === 'hombre');

  const renderMegaMenu = (cat: Category | undefined) => {
    if (!cat || cat.subcategories.length === 0) return null;
    return (
      <div
        className="absolute top-full left-0 w-64 p-5 rounded-b-xl shadow-xl border-t z-50"
        style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}
        onMouseEnter={() => handleMegaEnter(cat.slug || '')}
        onMouseLeave={handleMegaLeave}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: BRAND_COLORS.textMuted }}>
          {cat.description || cat.name}
        </p>
        <div className="flex flex-col gap-1.5">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/${cat.slug}?subcategoria=${encodeURIComponent(sub.name)}`}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: BRAND_COLORS.text }}
              onClick={() => { setMenuOpen(false); setMegaOpen(null); }}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ backgroundColor: '#292524' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-8">
          <span className="text-[11px] tracking-wider font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            Envíos a toda Guatemala{' '}
              <svg className="inline-block w-4 h-3 align-baseline" viewBox="0 0 24 18">
                <rect width="24" height="18" fill="#4997D0"/>
                <rect y="6" width="24" height="6" fill="#FFFFFF"/>
                <rect y="6" width="24" height="6" fill="#4997D0" clipPath="polygon(0 6, 10 6, 10 0, 14 0, 14 6, 24 6, 24 12, 14 12, 14 18, 10 18, 10 12, 0 12)" style={{clipPath: 'polygon(0 6, 10 6, 10 0, 14 0, 14 6, 24 6, 24 12, 14 12, 14 18, 10 18, 10 12, 0 12)'}}/>
              </svg>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(250,247,242,0.95)', backdropFilter: 'blur-sm', borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:shadow-lg"
                style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}
              >
                EB
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ color: BRAND_COLORS.text }}>
                {SITE_CONFIG.name}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const hasMega = (link.href === '/mujer' || link.href === '/hombre');
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => hasMega && handleMegaEnter(link.href.slice(1))}
                    onMouseLeave={handleMegaLeave}
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium transition-colors animate-underline-center py-1 block"
                      style={{ color: isActive(link.href) ? BRAND_COLORS.text : BRAND_COLORS.textMuted }}
                    >
                      {link.label}
                    </Link>
                    {hasMega && megaOpen === link.href.slice(1) && renderMegaMenu(
                      categories.find((c) => c.slug === link.href.slice(1))
                    )}
                  </div>
                );
              })}
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {SITE_CONFIG.whatsappDisplay}
              </a>
            </nav>

            <button
              className="md:hidden p-2 relative z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setMenuOpen(false)} />
      )}

      {menuOpen && (
        <div className="fixed top-0 left-0 h-full w-72 z-40 md:hidden shadow-2xl animate-slide-in-left" style={{ backgroundColor: BRAND_COLORS.background }}>
          <div className="flex flex-col pt-20 px-6 h-full">
            <div className="flex items-center gap-3 mb-10 border-b pb-6" style={{ borderColor: '#e5e0d8' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: BRAND_COLORS.primary, color: BRAND_COLORS.white }}>
                EB
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: BRAND_COLORS.text }}>{SITE_CONFIG.name}</p>
                <p className="text-xs" style={{ color: BRAND_COLORS.textMuted }}>{SITE_CONFIG.tagline}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 overflow-y-auto flex-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all block"
                    style={{
                      backgroundColor: isActive(link.href) ? 'rgba(212,163,115,0.15)' : 'transparent',
                      color: isActive(link.href) ? BRAND_COLORS.primary : BRAND_COLORS.textMuted,
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {(link.href === '/mujer' || link.href === '/hombre') && (
                    <div className="ml-4 mt-1 mb-2 flex flex-col gap-1">
                      {categories
                        .filter((c) => c.slug === link.href.slice(1))
                        .flatMap((c) => c.subcategories)
                        .map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/${link.href.slice(1)}?subcategoria=${encodeURIComponent(sub.name)}`}
                            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                            style={{ color: BRAND_COLORS.textMuted }}
                            onClick={() => setMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="pt-6 border-t" style={{ borderColor: '#e5e0d8' }}>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {SITE_CONFIG.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
