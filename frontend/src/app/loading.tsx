import { BRAND_COLORS } from '@/lib/config';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.background }}>
      <div className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: BRAND_COLORS.text, borderTopColor: 'transparent' }} />
    </div>
  );
}
