'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    catalog: 'CATALOG',
    portfolio: 'PORTFOLIO',
    reviews: 'REVIEWS',
    about: 'ABOUT',
    cart: 'CART',
    
    // Hero Section
    heroTitle: 'DIGITAL ASSET MARKETPLACE',
    exploreCatalog: 'EXPLORE CATALOG',
    
    // Sections
    featuredItems: 'Featured Digital Items',
    viewAll: 'VIEW ALL',
    product: 'Product',
    
    // Language
    english: 'English',
    indonesian: 'Indonesian',
  },
  id: {
    // Navigation
    catalog: 'KATALOG',
    portfolio: 'PORTOFOLIO',
    reviews: 'ULASAN',
    about: 'TENTANG',
    cart: 'KERANJANG',
    
    // Hero Section
    heroTitle: 'MARKETPLACE ASET DIGITAL',
    exploreCatalog: 'JELAJAHI KATALOG',
    
    // Sections
    featuredItems: 'Item Digital Unggulan',
    viewAll: 'LIHAT SEMUA',
    product: 'Produk',
    
    // Language
    english: 'Bahasa Inggris',
    indonesian: 'Bahasa Indonesia',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check for saved language preference or default to 'en'
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguageState(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('id')) {
        setLanguageState('id');
      } else {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}