import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, MessageSquare, Facebook, Twitter, Instagram, Linkedin, Youtube, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@trendify.agency',
    phone: '+966 50 123 4567',
    address_ar: 'الرياض، المملكة العربية السعودية',
    address_en: 'Riyadh, Saudi Arabia'
  });
  const [socialLinks, setSocialLinks] = useState<Array<{
    platform: string;
    url?: string;
    active: boolean;
  }>>([]);

  useEffect(() => {
    loadContactInfo();
    loadSocialLinks();
  }, []);

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

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'whatsapp': return MessageSquare;
      case 'youtube': return Youtube;
      case 'tiktok': return Music;
      default: return null;
    }
  };

  const socialLinksData = socialLinks.map(link => {
    const IconComponent = getSocialIcon(link.platform);
    return IconComponent ? { icon: IconComponent, url: link.url!, label: link.platform } : null;
  }).filter(Boolean);

  const contactInfoData = [
    { icon: Mail, title: isRTL ? 'البريد الإلكتروني' : 'Email', value: contactInfo.email, link: `mailto:${contactInfo.email}` },
    { icon: Phone, title: isRTL ? 'الهاتف' : 'Phone', value: contactInfo.phone, link: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
    { icon: MessageSquare, title: isRTL ? 'واتساب' : 'WhatsApp', value: contactInfo.phone, link: `https://wa.me/${contactInfo.phone.replace(/\s|\+/g, '')}` },
    { icon: MapPin, title: isRTL ? 'العنوان' : 'Address', value: isRTL ? contactInfo.address_ar : contactInfo.address_en, link: null }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'تواصل معنا' : 'CONTACT'}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfoData.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="border border-border/50 bg-background hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-muted-foreground mb-0.5">{info.title}</h3>
                        {info.link ? (
                          <a 
                            href={info.link}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors break-words"
                            dir={info.title.includes('Phone') || info.title.includes('الهاتف') ? 'ltr' : 'auto'}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground break-words">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2">
            <Card className="border border-border/50 bg-background h-full">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  {isRTL ? 'تابعنا على وسائل التواصل' : 'Follow Us'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {socialLinksData.length > 0 ? (
                    socialLinksData.map((social, index) => {
                      const IconComponent = social!.icon;
                      return (
                        <a
                          key={index}
                          href={social!.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group border border-border/50"
                        >
                          <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-xs font-medium text-muted-foreground capitalize">{social!.label}</span>
                        </a>
                      );
                    })
                  ) : (
                    <p className="col-span-full text-center text-sm text-muted-foreground">
                      {isRTL ? 'لا توجد روابط متاحة' : 'No social links available'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
