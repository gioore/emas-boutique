'use client';

import { useEffect, useState } from 'react';

export default function AdminConfigPage() {
  const [form, setForm] = useState({
    site_name: '', site_description: '', whatsapp: '', email: '', instagram: '', hero_title: '', hero_subtitle: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const clear = () => setMessage(null);

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setForm({
          site_name: res.data.site_name || '',
          site_description: res.data.site_description || '',
          whatsapp: res.data.whatsapp || '',
          email: res.data.email || '',
          instagram: res.data.instagram || '',
          hero_title: res.data.hero_title || '',
          hero_subtitle: res.data.hero_subtitle || '',
        });
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    clear();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      });
      const json = await res.json();
      if (json.data) setMessage({ type: 'success', text: 'Información guardada correctamente' });
      else setMessage({ type: 'error', text: json.error || 'Error al guardar' });
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Configuración</h1>
        <p className="mt-1" style={{ color: '#78716c' }}>Actualiza tu información de contacto</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-5" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Nombre de la tienda</label>
            <input type="text" value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} onFocus={clear}
              placeholder="EMAS Boutique"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
              style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Descripción del sitio</label>
            <input type="text" value={form.site_description} onChange={(e) => setForm({ ...form, site_description: e.target.value })} onFocus={clear}
              placeholder="Boutique de moda en Guatemala"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
              style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Número de WhatsApp</label>
            <input type="text" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} onFocus={clear}
              placeholder="+502 4763-3183"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
              style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Instagram</label>
            <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} onFocus={clear}
              placeholder="emasboutique"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
              style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Correo electrónico</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onFocus={clear}
              placeholder="info@emasboutique.com"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
              style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Título del Hero</label>
            <input type="text" value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} onFocus={clear}
              placeholder="Elegancia que Inspira"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
              style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Subtítulo del Hero</label>
          <input type="text" value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} onFocus={clear}
            placeholder="Descubre las últimas tendencias en moda femenina y masculina"
            className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#d4a373]/40"
            style={{ borderColor: '#d6d3d1', color: '#1c1917' }} />
        </div>

        {message && (
          <div
            className="px-4 py-3 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#4a7c59' : '#991b1b',
            }}
          >
            {message.text}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#d4a373' }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
