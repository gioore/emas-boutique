'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAuth = useCallback(async (showExpired = false) => {
    if (pathname === '/admin/login') return;
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        setAuthed(true);
      } else {
        if (showExpired) setSessionExpired(true);
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authed && pathname !== '/admin/login') {
      intervalRef.current = setInterval(() => {
        checkAuth(true);
      }, 300000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [authed, checkAuth, pathname]);

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

  if (!authed || sessionExpired) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-14 lg:pt-0" style={{ backgroundColor: '#faf7f2' }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
