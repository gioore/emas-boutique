'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#faf7f2' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-4" style={{ backgroundColor: '#1c1917' }}>
            <img src="/brand/logo-header.jpg" alt="EMAS Boutique" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>EMAS Boutique Admin</h1>
          <p className="mt-1" style={{ color: '#78716c' }}>Inicia sesión para administrar</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl shadow-sm border p-6 space-y-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#d4a373]"
              style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#44403c' }}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#d4a373]"
              style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
