'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Sun, Moon, Menu, X, Globe, ShoppingCart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close language menu when toggling mobile menu
    if (!mobileMenuOpen) setLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const navItems = [
    { key: 'catalog', label: t('catalog'), href: '/catalog' },
    { key: 'portfolio', label: t('portfolio'), href: '#' },
    { key: 'contact', label: t('contact'), href: '/contact' },
    { key: 'about', label: t('about'), href: '#' },
  ];

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="pixel-font text-2xl font-bold text-foreground"
            whileHover={{ scale: 1.05 }}
          >
            DAMA
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.key}
                href={item.href}
                className="text-foreground hover:text-accent transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={toggleLanguageMenu}
                className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-background transition-colors flex items-center space-x-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Change language"
              >
                <Globe size={20} />
                <span className="text-xs font-medium">{language.toUpperCase()}</span>
              </motion.button>
              
              {/* Language Dropdown */}
              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-40 bg-card-bg border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors ${language === 'en' ? 'text-accent' : 'text-foreground'}`}
                    >
                      {t('english')}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('id');
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors ${language === 'id' ? 'text-accent' : 'text-foreground'}`}
                    >
                      {t('indonesian')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-background transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            {/* Cart Icon */}
            <motion.div
              className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-background transition-colors cursor-pointer relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={20} />
              {/* Cart badge */}
              <span className="absolute -top-1 -right-1 bg-accent text-background text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                0
              </span>
            </motion.div>
            
            {/* User Icon */}
            <motion.div
              className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-background transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} />
            </motion.div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Theme Toggle (Mobile) */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-background transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            {/* Menu Toggle */}
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-background transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-background border-b border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  className="block py-2 px-3 text-foreground hover:text-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.a>
              ))}
              
              {/* Language Selector (Mobile) */}
              <div className="py-2 px-3">
                <div className="font-medium text-foreground mb-2">{language === 'en' ? 'Language' : 'Bahasa'}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md ${language === 'en' ? 'bg-accent text-background' : 'bg-secondary text-foreground'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('id')}
                    className={`px-3 py-1 rounded-md ${language === 'id' ? 'bg-accent text-background' : 'bg-secondary text-foreground'}`}
                  >
                    ID
                  </button>
                </div>
              </div>
              
              {/* Cart (Mobile) */}
              <motion.a
                href="#"
                className="flex items-center py-2 px-3 text-foreground hover:text-accent rounded-md transition-colors"
                whileHover={{ x: 5 }}
              >
                <ShoppingCart size={18} className="mr-3" />
                {t('cart')}
                <span className="ml-auto bg-accent text-background text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </motion.a>
              
              {/* User Profile (Mobile) */}
              <motion.a
                href="#"
                className="flex items-center py-2 px-3 text-foreground hover:text-accent rounded-md transition-colors"
                whileHover={{ x: 5 }}
              >
                <User size={18} className="mr-2" />
                <span>{language === 'en' ? 'Profile' : 'Profil'}</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;