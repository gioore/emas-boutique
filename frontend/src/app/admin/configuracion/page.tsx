'use client';

import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/config';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'emas_admin_config';

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

export default function AdminConfiguracion() {
  const router = useRouter();
  const [form, setForm] = useState<ConfigForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setForm(JSON.parse(stored));
        return;
      } catch {
        // fall through to defaults
      }
    }
    setForm({
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
    });
  }, []);

  const update = (key: keyof ConfigForm, value: string) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (!form) return;
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  };

  const handleCancel = () => {
    router.push('/admin');
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
            onClick={handleCancel}
            className="px-5 py-2.5 font-medium rounded-lg transition-colors text-sm border"
            style={{ borderColor: '#d6d3d1', color: '#44403c' }}
          >
            Cancelar
          </button>
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
