
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { locale } = useLocale();

  useEffect(() => {
    router.replace('/dashboard/chat/new');
  }, [router, locale]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
