
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import bn from '@/locales/bn.json';
import ta from '@/locales/ta.json';
import kn from '@/locales/kn.json';

type Locale = 'en' | 'hi' | 'bn' | 'ta' | 'kn';

const translations: Record<Locale, any> = {
  en,
  hi,
  bn,
  ta,
  kn
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const storedLocale = localStorage.getItem('legalsphere_locale') as Locale | null;
    if (storedLocale && translations[storedLocale]) {
      setLocale(storedLocale);
    }
  }, []);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('legalsphere_locale', newLocale);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[locale][key] || key;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
