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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwError('Todos los campos son requeridos');
      return;
    }
    if (pwNew.length < 6) {
      setPwError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwError('Las contraseñas no coinciden');
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar contraseña');
      setPwSuccess('Contraseña actualizada exitosamente');
      setPwCurrent('');
      setPwNew('');
      setPwConfirm('');
      setTimeout(() => { setShowPasswordModal(false); setPwSuccess(''); }, 2000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setPwSaving(false);
    }
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

      <aside
        className={`
          ${menuOpen ? 'block' : 'hidden'} lg:block
          w-full lg:w-64 lg:min-h-screen
          flex flex-col
        `}
        style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
      >
        <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: '#292524' }}>
          <div className="w-9 h-9 rounded-full overflow-hidden" style={{ backgroundColor: '#d4a373' }}>
            <img src="/brand/logo-header.jpg" alt="EMAS Boutique" className="w-full h-full object-cover" />
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
            onClick={() => { setShowPasswordModal(true); setPwError(''); setPwSuccess(''); setPwCurrent(''); setPwNew(''); setPwConfirm(''); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full"
            style={{ color: '#78716c' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Cambiar Contraseña
          </button>
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

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-xl p-6 max-w-sm w-full shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1c1917' }}>Cambiar Contraseña</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {pwError && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>{pwError}</div>
              )}
              {pwSuccess && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>{pwSuccess}</div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Contraseña actual</label>
                <input type="password" required value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm" style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Nueva contraseña</label>
                <input type="password" required value={pwNew} onChange={(e) => setPwNew(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm" style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Confirmar nueva contraseña</label>
                <input type="password" required value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm" style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border font-medium rounded-lg text-sm" style={{ borderColor: '#d6d3d1', color: '#44403c' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={pwSaving}
                  className="px-4 py-2 font-medium rounded-lg text-sm disabled:opacity-50" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
                  {pwSaving ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
