import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Music, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import commercialRegisterQR from '@/assets/commercial-register-qr.png';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const ctaRef = useScrollAnimation();
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
      if (data) setSocialLinks(data);
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
    return IconComponent ? { icon: IconComponent, url: link.url!, label: link.platform } : null;
  }).filter(Boolean);

  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section with gradient bg */}
      <div className="relative bg-gradient-to-br from-foreground via-foreground to-primary/90">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--accent)) 0%, transparent 50%)'
        }} />
        
        <div ref={ctaRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative z-10 scroll-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 text-background/70 text-xs font-semibold tracking-wider uppercase mb-6">
            {isRTL ? 'هل أنت مستعد؟' : 'Ready to create?'}
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-background tracking-tight mb-6">
            {isRTL ? 'لنبني شيئاً رائعاً معاً' : "Let's build something great"}
          </h2>
          <p className="text-lg text-background/60 max-w-xl mx-auto mb-10">
            {isRTL 
              ? 'نحن هنا لمساعدتك في تحقيق أهدافك الرقمية. تواصل معنا اليوم.'
              : "We partner with brands to create performance-driven content. Let's talk."}
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-background text-foreground hover:bg-background/90 hover:shadow-xl transition-all duration-300 text-sm font-semibold"
          >
            <Mail className="h-4 w-4" />
            {contactInfo.email}
            <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold font-heading text-background mb-4">Trendify</h3>
              <p className="text-sm text-background/60 leading-relaxed">
                {t('footer.description')}
              </p>
              <div className="flex gap-2 mt-4">
                {socialLinksData.map((social, index) => {
                  const IconComponent = social!.icon;
                  return (
                    <a
                      key={index}
                      href={social!.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social!.label}
                      className="w-9 h-9 bg-background/10 hover:bg-primary/30 rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-background mb-4">
                {isRTL ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: isRTL ? 'الرئيسية' : 'Home', href: '/' },
                  { label: isRTL ? 'من نحن' : 'About', href: '/about' },
                  { label: isRTL ? 'خدماتنا' : 'Services', href: '/services' },
                  { label: isRTL ? 'أعمالنا' : 'Portfolio', href: '/portfolio' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-background/60 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commercial Register */}
            <div>
              <h4 className="text-sm font-semibold text-background mb-4">
                {isRTL ? 'السجل التجاري' : 'Commercial Register'}
              </h4>
              <img 
                src={commercialRegisterQR} 
                alt={isRTL ? 'رمز QR للسجل التجاري' : 'Commercial Register QR Code'} 
                className="w-32 h-32 object-contain bg-white rounded-lg p-2"
              />
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-background mb-4">
                {isRTL ? 'تواصل معنا' : 'Contact'}
              </h4>
              <div className="space-y-2.5 text-sm text-background/60">
                <p>{contactInfo.email}</p>
                <p dir="ltr" className="inline-block">{contactInfo.phone}</p>
                <p>{isRTL ? contactInfo.address_ar : contactInfo.address_en}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-background/10 py-6 text-center">
            <p className="text-xs text-background/40">
              © {new Date().getFullYear()} Trendify. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
