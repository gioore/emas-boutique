import WhatsAppIcon from '@/components/WhatsAppIcon';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Contacto - ${SITE_CONFIG.name}`,
  description: 'Ponte en contacto con EMAS Boutique por WhatsApp, Instagram o correo electrónico. Estamos en Guatemala.',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Contacto</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xl mb-12" style={{ color: BRAND_COLORS.textMuted }}>
          Estamos aquí para ayudarte. Elige el canal de tu preferencia y te atenderemos
          con la mayor rapidez.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl p-8 border" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: BRAND_COLORS.white }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLORS.text} strokeWidth="1.5"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>WhatsApp</h2>
            <p className="mb-4" style={{ color: BRAND_COLORS.textMuted }}>
              Respuesta rápida y atención personalizada.
            </p>
            <Link
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              {SITE_CONFIG.whatsappDisplay}
            </Link>
          </div>
          <div className="rounded-2xl p-8 border" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: BRAND_COLORS.white }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLORS.text} strokeWidth="1.5"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>Instagram</h2>
            <p className="mb-4" style={{ color: BRAND_COLORS.textMuted }}>
              Descubre nuestras últimas colecciones y novedades.
            </p>
            <Link
              href={`https://instagram.com/${SITE_CONFIG.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: BRAND_COLORS.black }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.11 2.525c.636-.247 1.363-.416 2.427-.465C8.88 2.013 9.235 2 12.315 2zm0 2.048c-2.39 0-2.723.013-3.681.047-1.01.036-1.558.215-1.922.357-.48.188-.823.413-1.183.773-.36.36-.585.704-.773 1.183-.142.364-.321.911-.357 1.922-.034.958-.047 1.291-.047 3.681s.013 2.723.047 3.681c.036 1.01.215 1.558.357 1.922.188.48.413.823.773 1.183.36.36.704.585 1.183.773.364.142.911.321 1.922.357.958.034 1.291.047 3.681.047s2.723-.013 3.681-.047c1.01-.036 1.558-.215 1.922-.357.48-.188.823-.413 1.183-.773.36-.36.585-.704.773-1.183.142-.364.321-.911.357-1.922.034-.958.047-1.291.047-3.681s-.013-2.723-.047-3.681c-.036-1.01-.215-1.558-.357-1.922-.188-.48-.413-.823-.773-1.183-.36-.36-.704-.585-1.183-.773-.364-.142-.911-.321-1.922-.357-.958-.034-1.291-.047-3.681-.047zm0 3.543a5.145 5.145 0 100 10.29 5.145 5.145 0 100-10.29zm0 8.242a3.097 3.097 0 110-6.194 3.097 3.097 0 010 6.194zm5.33-7.868a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" /></svg>
              @{SITE_CONFIG.instagram}
            </Link>
          </div>
          <div className="rounded-2xl p-8 border" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: BRAND_COLORS.white }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLORS.text} strokeWidth="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>Correo Electrónico</h2>
            <p className="mb-4" style={{ color: BRAND_COLORS.textMuted }}>
              Escríbenos para consultas o sugerencias.
            </p>
            {SITE_CONFIG.email ? (
              <Link
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                style={{ border: `2px solid ${BRAND_COLORS.text}`, color: BRAND_COLORS.text }}
              >
                {SITE_CONFIG.email}
              </Link>
            ) : (
              <p className="font-semibold" style={{ color: BRAND_COLORS.textMuted }}>
                Próximamente
              </p>
            )}
          </div>
          <div className="rounded-2xl p-8 border" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: BRAND_COLORS.white }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLORS.text} strokeWidth="1.5"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>Ubicación</h2>
            <p className="mb-4" style={{ color: BRAND_COLORS.textMuted }}>
              Realizamos entregas en toda Guatemala.
            </p>
            <p className="font-semibold" style={{ color: BRAND_COLORS.text }}>
              Ciudad de Guatemala y departamentos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
