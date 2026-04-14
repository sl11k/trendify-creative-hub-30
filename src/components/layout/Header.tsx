import React, { useState, useEffect } from 'react';
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-primary hover:scale-105 transition-transform duration-300">
                Trendify
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`text-foreground hover:text-primary transition-colors duration-200 font-medium px-1 ${
                    isActive ? 'text-primary border-b-2 border-primary' : ''
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
              aria-label={isRTL ? 'تغيير اللغة' : 'Change Language'}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'العربية'}
            </Button>

            {/* CTA Button */}
            <Link to="/contact">
              <Button
                variant="hero"
                size="sm"
                className="rounded-full"
              >
                {t('hero.cta.primary')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2"
              aria-label={isRTL ? 'تغيير اللغة' : 'Change Language'}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'ع'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? (isRTL ? 'إغلاق القائمة' : 'Close Menu') : (isRTL ? 'فتح القائمة' : 'Open Menu')}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium ${
                      isActive ? 'text-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
              <div className="px-3 py-2">
                <Link to="/contact" className="block">
                  <Button
                    variant="default"
                    className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300"
                  >
                    {t('hero.cta.primary')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;