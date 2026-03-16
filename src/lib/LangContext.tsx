'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from './i18n';
import { t } from './i18n';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  dir: 'ltr',
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', l);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'ltr');
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: (k) => t(lang, k), dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
