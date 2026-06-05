'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setAuthed(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f2' }}>
        <div className="w-8 h-8 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: '#1c1917', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#faf7f2' }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
