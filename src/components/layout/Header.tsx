import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.services', href: '/services' },
    { key: 'nav.portfolio', href: '/portfolio' },
    { key: isRTL ? 'أدواتنا' : 'Tools', href: '/tools' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Trendify
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Right aligned */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5"
              aria-label={isRTL ? 'تغيير اللغة' : 'Change Language'}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'العربية'}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
              aria-label={isRTL ? 'تغيير اللغة' : 'Change Language'}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'ع'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground p-1"
              aria-label={isMenuOpen ? (isRTL ? 'إغلاق القائمة' : 'Close Menu') : (isRTL ? 'فتح القائمة' : 'Open Menu')}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50">
            <div className="py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`block px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      isActive ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
