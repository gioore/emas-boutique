'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/categorias', label: 'Categorías', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/admin/subcategorias', label: 'Subcategorías', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { href: '/admin/marcas', label: 'Marcas', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { href: '/admin/productos/nuevo', label: 'Nuevo Producto', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b" style={{ backgroundColor: '#1c1917', borderColor: '#292524' }}>
        <span className="text-white font-bold text-sm">EMAS Admin</span>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-white" aria-label="Menú">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col min-h-screen
        `}
        style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
      >
        <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: '#292524' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#d4a373', color: '#1c1917' }}>
            EB
          </div>
          <div>
            <Link href="/admin" className="text-sm font-bold tracking-tight block">
              EMAS Admin
            </Link>
            <span className="text-xs" style={{ color: '#a8a29e' }}>Panel de control</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff' } : { color: '#a8a29e' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-1" style={{ borderColor: '#292524' }}>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            style={{ color: '#a8a29e' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ver Tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full"
            style={{ color: '#ef4444' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Spacer for mobile top bar */}
      <div className="lg:hidden h-14" />
    </>
  );
}
