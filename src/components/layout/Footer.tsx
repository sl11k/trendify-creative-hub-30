import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const [socialLinks, setSocialLinks] = useState<Array<{
    platform: string;
    url?: string;
    active: boolean;
  }>>([]);
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@trendify.agency',
    phone: '+966 50 123 4567',
    address_ar: 'الرياض، المملكة العربية السعودية',
    address_en: 'Riyadh, Saudi Arabia'
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
          email: settings.contact_email || 'hello@trendify.agency',
          phone: settings.contact_phone || '+966 50 123 4567',
          address_ar: settings.contact_address_ar || 'الرياض، المملكة العربية السعودية',
          address_en: settings.contact_address_en || 'Riyadh, Saudi Arabia'
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
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.services', href: '#services' },
    { key: 'nav.contact', href: '#contact' }
  ];

  const services = [
    'services.digital-marketing.title',
    'services.web-dev.title',
    'services.graphic-design.title',
    'services.social-media.title'
  ];

  return (
    <footer className="bg-gradient-hero text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Trendify</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinksData.map((social, index) => {
                const IconComponent = social!.icon;
                return (
                  <a
                    key={index}
                    href={social!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social!.label}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
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

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isRTL ? 'خدماتنا' : 'Our Services'}
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {t(service)}
                  </a>
                </li>
              ))}
            </ul>
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
                <strong>{isRTL ? 'الهاتف:' : 'Phone:'}</strong><br />
                {contactInfo.phone}
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
            © 2024 Trendify. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;