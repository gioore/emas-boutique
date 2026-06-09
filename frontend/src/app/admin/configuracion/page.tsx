'use client';

import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/config';

interface ConfigForm {
  name: string;
  tagline: string;
  description: string;
  instagram: string;
  whatsapp: string;
  whatsappDisplay: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  footerDescription: string;
}

const DEFAULTS: ConfigForm = {
  name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  instagram: SITE_CONFIG.instagram,
  whatsapp: SITE_CONFIG.whatsapp,
  whatsappDisplay: SITE_CONFIG.whatsappDisplay,
  heroTitle: SITE_CONFIG.heroTitle,
  heroSubtitle: SITE_CONFIG.heroSubtitle,
  heroDescription: SITE_CONFIG.heroDescription,
  footerDescription: SITE_CONFIG.footer.description,
};

export default function AdminConfiguracion() {
  const [form, setForm] = useState<ConfigForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => { if (r.status === 401) { window.location.href = '/admin/login'; return null; } return r.json(); })
      .then((res) => {
        if (res?.data && Object.keys(res.data).length > 0) setForm({ ...DEFAULTS, ...res.data });
        else setForm(DEFAULTS);
      })
      .catch(() => setForm(DEFAULTS));
  }, []);

  const update = (key: keyof ConfigForm, value: string) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      });
      if (res.status === 401) { window.location.href = '/admin/login'; return; }
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Error al guardar'); }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: '#1c1917', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>Configuración</h1>
          <p className="mt-1" style={{ color: '#78716c' }}>
            Administra la configuración general del sitio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
            style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
          >
            {saving ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Información General */}
        <section className="rounded-xl border p-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1c1917' }}>Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Nombre del Sitio</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => update('tagline', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Descripción del Sitio</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm resize-none"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
          </div>
        </section>

        {/* Redes Sociales */}
        <section className="rounded-xl border p-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1c1917' }}>Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>WhatsApp (número)</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>WhatsApp (display)</label>
              <input
                type="text"
                value={form.whatsappDisplay}
                onChange={(e) => update('whatsappDisplay', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Instagram (usuario)</label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => update('instagram', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="rounded-xl border p-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1c1917' }}>Hero (Página Principal)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Título</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => update('heroTitle', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Subtítulo</label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => update('heroSubtitle', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Descripción</label>
              <textarea
                value={form.heroDescription}
                onChange={(e) => update('heroDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm resize-none"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="rounded-xl border p-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1c1917' }}>Footer</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#44403c' }}>Descripción del Footer</label>
              <textarea
                value={form.footerDescription}
                onChange={(e) => update('footerDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm resize-none"
                style={{ borderColor: '#d6d3d1', backgroundColor: '#ffffff', color: '#1c1917' }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
