'use client';
import { useLayoutEffect } from 'react';

export default function ScrollToTop({ trigger }: { trigger: string }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [trigger]);
  return null;
}
