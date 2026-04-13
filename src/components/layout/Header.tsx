import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';

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
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="py-5 px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Trendify" className="h-8" width={32} height={32} />
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
                  className={`text-foreground/90 hover:text-foreground transition-colors duration-200 font-medium text-sm ${
                    isActive ? 'text-foreground' : ''
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-full border-foreground/20 text-foreground/90 hover:text-foreground hover:bg-foreground/5"
              aria-label={isRTL ? 'تغيير اللغة' : 'Change Language'}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'العربية'}
            </Button>

            <Link to="/contact">
              <Button
                variant="heroSecondary"
                className="rounded-full px-4 py-2"
              >
                {t('hero.cta.primary')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 text-foreground/90"
              aria-label={isRTL ? 'تغيير اللغة' : 'Change Language'}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'ع'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
              aria-label={isMenuOpen ? (isRTL ? 'إغلاق القائمة' : 'Close Menu') : (isRTL ? 'فتح القائمة' : 'Open Menu')}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="mt-[3px] h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-b border-border">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`block px-3 py-2 text-foreground/90 hover:text-foreground transition-colors duration-200 font-medium ${
                    isActive ? 'text-foreground' : ''
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
                  variant="heroSecondary"
                  className="w-full rounded-full"
                >
                  {t('hero.cta.primary')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
