import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import commercialRegisterQR from '@/assets/commercial-register-qr.png';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const [socialLinks, setSocialLinks] = useState<Array<{
    platform: string;
    url?: string;
    active: boolean;
  }>>([]);
  const [contactInfo, setContactInfo] = useState({
    email: 'info@trendify.sa',
    phone: '+966 50 123 4567',
    address_ar: 'المملكة العربية السعودية',
    address_en: 'Saudi Arabia'
  });

  useEffect(() => {
    loadSocialLinks();
    loadContactInfo();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const { data } = await supabase
        .from('social_links')
        .select('*')
        .eq('active', true)
        .not('url', 'is', null)
        .neq('url', '');

      if (data) {
        setSocialLinks(data);
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  };

  const loadContactInfo = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['contact_email', 'contact_phone', 'contact_address_ar', 'contact_address_en']);

      if (data) {
        const settings = data.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value;
          return acc;
        }, {} as Record<string, string>);

        setContactInfo({
          email: settings.contact_email || 'info@trendify.sa',
          phone: settings.contact_phone || '+966 50 123 4567',
          address_ar: settings.contact_address_ar || 'المملكة العربية السعودية',
          address_en: settings.contact_address_en || 'Saudi Arabia'
        });
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'whatsapp': return MessageCircle;
      case 'youtube': return Youtube;
      case 'tiktok': return Music;
      default: return null;
    }
  };

  const socialLinksData = socialLinks.map(link => {
    const IconComponent = getSocialIcon(link.platform);
    return IconComponent ? {
      icon: IconComponent,
      url: link.url!,
      label: link.platform
    } : null;
  }).filter(Boolean);

  const quickLinks = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.services', href: '/services' },
    { key: 'nav.portfolio', href: '/portfolio' },
    { key: 'nav.contact', href: '/contact' }
  ];

  return (
    <footer className="bg-card text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-gradient-primary">Trendify</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinksData.map((social, index) => {
                const IconComponent = social!.icon;
                return (
                  <a
                    key={index}
                    href={social!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social!.label}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 mx-1"
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Commercial Register */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isRTL ? 'السجل التجاري' : 'Commercial Register'}
            </h4>
            <div className="flex justify-center md:justify-start">
              <img
                src={commercialRegisterQR}
                alt={isRTL ? 'رمز QR للسجل التجاري' : 'Commercial Register QR Code'}
                className="w-40 h-40 object-contain bg-white rounded-lg p-2"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div className="space-y-3">
              <p className="text-white/80">
                <strong>{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</strong><br />
                {contactInfo.email}
              </p>
              <p className="text-white/80">
                <strong>{isRTL ? 'الموقع:' : 'Website:'}</strong><br />
                <a href="https://www.trendify.sa" className="hover:text-white" dir="ltr">www.trendify.sa</a>
              </p>
              <p className="text-white/80">
                <strong>{isRTL ? 'العنوان:' : 'Address:'}</strong><br />
                {isRTL ? contactInfo.address_ar : contactInfo.address_en}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 py-6 text-center">
          <p className="text-white/80">
            © {new Date().getFullYear()} Trendify. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
