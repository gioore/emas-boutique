import Link from 'next/link';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { SITE_CONFIG } from '@/lib/config';

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[700px] overflow-hidden" style={{ backgroundColor: '#1c1917' }}>
      {/* Gradient overlays */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(199,111,75,0.4) 0%, rgba(28,25,23,0.6) 40%, rgba(28,25,23,0.9) 70%, rgba(28,25,23,1) 100%)',
        }}
      />

      {/* Animated wave pattern */}
      <div className="absolute inset-0 z-10 opacity-20 animate-wave-move" style={{ width: '150%', marginLeft: '-25%' }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 600 Q 360 400, 720 550 T 1440 500 V 900 H 0 Z"
            fill="rgba(212,163,115,0.15)"
          />
          <path
            d="M0 650 Q 360 500, 720 600 T 1440 550 V 900 H 0 Z"
            fill="rgba(199,111,75,0.1)"
          />
        </svg>
      </div>

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 z-10 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* EB watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none">
        <span className="text-[clamp(12rem,25vw,25rem)] font-black tracking-tighter opacity-[0.03]" style={{ color: '#d4a373' }}>
          EB
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-transparent to-transparent z-10" />

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: "url('/brand/hero-bg.svg')",
          backgroundColor: '#292524',
          opacity: 0.2,
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="animate-fade-in-down">
          <div className="w-16 h-0.5 mx-auto mb-6 animate-glow-gold" style={{ backgroundColor: '#d4a373' }} />
          <span className="text-xs uppercase tracking-[0.4em] mb-6 font-medium block" style={{ color: '#d4a373' }}>
            Colección {new Date().getFullYear()}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-lg animate-fade-in-up text-balance">
          {SITE_CONFIG.heroTitle}
        </h1>

        <p
          className="text-lg sm:text-xl mb-3 max-w-lg drop-shadow-md animate-fade-in-up"
          style={{ color: '#d4a373', fontWeight: 500, letterSpacing: '0.08em' }}
        >
          {SITE_CONFIG.heroSubtitle}
        </p>

        <p className="text-base sm:text-lg mb-12 max-w-xl drop-shadow-md animate-fade-in-up" style={{ color: '#d6d3d1', lineHeight: 1.8 }}>
          {SITE_CONFIG.heroDescription}
        </p>

        <div className="flex gap-4 flex-wrap justify-center animate-fade-in-up">
          <Link
            href="/mujer"
            className="group relative overflow-hidden px-10 py-4 font-semibold rounded-full transition-all duration-300 shadow-xl inline-flex items-center gap-2"
            style={{ backgroundColor: '#d4a373', color: '#1c1917' }}
          >
            <span className="relative z-10">Ver Catálogo</span>
            <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-4 font-semibold rounded-full transition-all duration-300 inline-flex items-center gap-2"
            style={{ border: '2px solid rgba(255,255,255,0.8)', color: '#ffffff' }}
          >
            <WhatsAppIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Pedir por WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Descubre más
        </span>
        <svg className="w-5 h-5 animate-float" style={{ color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
