import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import commercialRegisterQR from '@/assets/commercial-register-qr.png';
import { Link } from 'react-router-dom';

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
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.contact', href: '/contact' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-primary text-glow-sm mb-4">Trendify</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinksData.map((social, index) => {
                const IconComponent = social!.icon;
                return (
                  <a
                    key={index}
                    href={social!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social!.label}
                    className="w-10 h-10 rounded-lg border border-border bg-secondary hover:bg-primary/10 hover:border-primary/30 flex items-center justify-center transition-all duration-300 group"
                  >
                    <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Commercial Register */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">
              {isRTL ? 'السجل التجاري' : 'Commercial Register'}
            </h4>
            <div className="flex justify-center md:justify-start">
              <div className="p-3 rounded-xl border border-border bg-secondary">
                <img 
                  src={commercialRegisterQR} 
                  alt={isRTL ? 'رمز QR للسجل التجاري' : 'Commercial Register QR Code'} 
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </p>
                <a href={`mailto:${contactInfo.email}`} className="text-foreground hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'الهاتف' : 'Phone'}
                </p>
                <a href={`tel:${contactInfo.phone}`} className="text-foreground hover:text-primary transition-colors">
                  <span dir="ltr" className="inline-block">{contactInfo.phone}</span>
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'العنوان' : 'Address'}
                </p>
                <p className="text-foreground">
                  {isRTL ? contactInfo.address_ar : contactInfo.address_en}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border py-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Trendify. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;