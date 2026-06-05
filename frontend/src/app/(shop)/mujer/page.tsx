import { Suspense } from 'react';
import MujerContent from './MujerContent';
import { BRAND_COLORS } from '@/lib/config';

export default function MujerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.white }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.primary, borderTopColor: 'transparent' }} />
      </div>
    }>
      <MujerContent />
    </Suspense>
  );
}
