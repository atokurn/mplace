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
    contact: 'CONTACT',
    about: 'ABOUT',
    cart: 'CART',
    login: 'LOGIN',
    signup: 'SIGN UP',
    
    // Hero Section
    heroTitle: 'DIGITAL ASSET MARKETPLACE',
    exploreCatalog: 'EXPLORE CATALOG',
    
    // Sections
    featuredItems: 'Featured Digital Items',
    viewAll: 'VIEW ALL',
    product: 'Product',
    
    // Authentication
    welcomeBack: 'WELCOME BACK',
    signInToAccount: 'Sign in to your account',
    createAccount: 'CREATE ACCOUNT',
    joinMarketplace: 'Join the digital marketplace',
    continueWithGoogle: 'Continue with Google',
    continueWithGithub: 'Continue with GitHub',
    orContinueWithEmail: 'Or continue with email',
    orCreateWithEmail: 'Or create with email',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    createAccountBtn: 'Create Account',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
    subscribeNewsletter: 'Subscribe to our newsletter for updates and exclusive offers',
    
    // Language
    english: 'English',
    indonesian: 'Indonesian',
  },
  id: {
    // Navigation
    catalog: 'KATALOG',
    portfolio: 'PORTOFOLIO',
    contact: 'KONTAK',
    about: 'TENTANG',
    cart: 'KERANJANG',
    login: 'MASUK',
    signup: 'DAFTAR',
    
    // Hero Section
    heroTitle: 'MARKETPLACE ASET DIGITAL',
    exploreCatalog: 'JELAJAHI KATALOG',
    
    // Sections
    featuredItems: 'Item Digital Unggulan',
    viewAll: 'LIHAT SEMUA',
    product: 'Produk',
    
    // Authentication
    welcomeBack: 'SELAMAT DATANG KEMBALI',
    signInToAccount: 'Masuk ke akun Anda',
    createAccount: 'BUAT AKUN',
    joinMarketplace: 'Bergabung dengan marketplace digital',
    continueWithGoogle: 'Lanjutkan dengan Google',
    continueWithGithub: 'Lanjutkan dengan GitHub',
    orContinueWithEmail: 'Atau lanjutkan dengan email',
    orCreateWithEmail: 'Atau buat dengan email',
    emailAddress: 'Alamat Email',
    password: 'Kata Sandi',
    confirmPassword: 'Konfirmasi Kata Sandi',
    firstName: 'Nama Depan',
    lastName: 'Nama Belakang',
    rememberMe: 'Ingat saya',
    forgotPassword: 'Lupa kata sandi?',
    signIn: 'Masuk',
    createAccountBtn: 'Buat Akun',
    dontHaveAccount: 'Belum punya akun?',
    alreadyHaveAccount: 'Sudah punya akun?',
    agreeToTerms: 'Saya setuju dengan Syarat Layanan dan Kebijakan Privasi',
    subscribeNewsletter: 'Berlangganan newsletter untuk update dan penawaran eksklusif',
    
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