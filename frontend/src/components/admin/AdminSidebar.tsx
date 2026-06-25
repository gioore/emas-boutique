'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SidebarIcon from './SidebarIcon';

const links = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/categorias', label: 'Categorías', icon: 'categories' },
  { href: '/admin/subcategorias', label: 'Subcategorías', icon: 'subcategories' },
  { href: '/admin/marcas', label: 'Marcas', icon: 'brands' },
  { href: '/admin/productos/nuevo', label: 'Nuevo Producto', icon: 'add' },
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
        <Link href="/admin/productos/nuevo" className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: '#d4a373', color: '#1c1917' }} aria-label="Nuevo Producto">
          +
        </Link>
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

      {/* Sidebar — in normal flow on mobile, static sidebar on desktop */}
      <aside
        className={`
          ${menuOpen ? 'block' : 'hidden'} lg:block
          w-full lg:w-64 lg:min-h-screen
          flex flex-col
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
            <span className="text-xs" style={{ color: '#78716c' }}>Panel de control</span>
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
                style={isActive ? { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff' } : { color: '#78716c' }}
              >
                <SidebarIcon name={link.icon} />
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
            style={{ color: '#78716c' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ver Tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full"
            style={{ color: '#dc2626' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
