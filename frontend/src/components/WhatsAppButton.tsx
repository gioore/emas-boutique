'use client';

import { useEffect, useState } from 'react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { SITE_CONFIG } from '@/lib/config';

interface Props {
  phone?: string;
  message?: string;
}

export default function WhatsAppButton({ phone = SITE_CONFIG.whatsapp, message = SITE_CONFIG.whatsappMessage }: Props) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center"
          style={{ backgroundColor: '#000000' , color: '#ffffff' }}
          aria-label="Volver arriba"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 flex items-center justify-center animate-glow-gold"
        style={{ backgroundColor: '#25D366', color: '#ffffff' }}
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  );
}
