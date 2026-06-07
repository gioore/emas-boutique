import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[650px] overflow-hidden" style={{ backgroundColor: '#1c1917' }}>
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(199,111,75,0.35) 0%, rgba(28,25,23,0.7) 40%, rgba(28,25,23,0.95) 70%, rgba(28,25,23,1) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-10 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-transparent to-transparent z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/brand/hero-bg.svg')",
          backgroundColor: '#292524',
          opacity: 0.3,
        }}
      />
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="animate-fade-in-down">
          <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: '#d4a373' }} />
          <span className="text-xs uppercase tracking-[0.35em] mb-6 font-medium block" style={{ color: '#d4a373' }}>
            Colección 2026
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-lg animate-fade-in-up text-balance">
          {SITE_CONFIG.heroTitle}
        </h1>
        <p className="text-lg sm:text-xl mb-3 max-w-lg drop-shadow-md animate-fade-in-up" style={{ color: '#d4a373', fontWeight: 500, letterSpacing: '0.05em' }}>
          {SITE_CONFIG.heroSubtitle}
        </p>
        <p className="text-base sm:text-lg mb-10 max-w-xl drop-shadow-md animate-fade-in-up" style={{ color: '#d6d3d1', lineHeight: 1.7 }}>
          {SITE_CONFIG.heroDescription}
        </p>
        <div className="flex gap-4 flex-wrap justify-center animate-fade-in-up">
          <Link
            href="/mujer"
            className="group px-10 py-4 font-semibold rounded-full hover:scale-105 active:scale-[0.98] transition-all duration-300 shadow-xl inline-flex items-center gap-2"
            style={{ backgroundColor: '#d4a373', color: '#1c1917' }}
          >
            <span>Ver Catálogo</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-4 font-semibold rounded-full hover:scale-105 active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2"
            style={{ border: '2px solid rgba(255,255,255,0.8)', color: '#ffffff' }}
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-float">
        <svg className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
