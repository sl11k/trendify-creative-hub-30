import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, MessageSquare, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  const [contactInfo, setContactInfo] = useState({
    email: 'info@trendify.sa',
    phone: '+966 50 123 4567',
    address_ar: 'المملكة العربية السعودية',
    address_en: 'Saudi Arabia',
    website: 'www.trendify.sa'
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
          email: settings.contact_email || 'info@trendify.sa',
          phone: settings.contact_phone || '+966 50 123 4567',
          address_ar: settings.contact_address_ar || 'المملكة العربية السعودية',
          address_en: settings.contact_address_en || 'Saudi Arabia',
          website: 'www.trendify.sa'
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

      if (data) {
        setSocialLinks(data);
      }
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
    return IconComponent ? {
      icon: IconComponent,
      url: link.url!,
      label: link.platform
    } : null;
  }).filter(Boolean);

  const contactInfoData = [
    {
      icon: Mail,
      title: isRTL ? 'البريد الإلكتروني' : 'Email',
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`
    },
    {
      icon: Globe,
      title: isRTL ? 'الموقع الإلكتروني' : 'Website',
      value: contactInfo.website,
      link: `https://${contactInfo.website}`
    },
    {
      icon: MessageSquare,
      title: isRTL ? 'تابعنا' : 'Follow Us',
      value: '@trendify_sa',
      link: 'https://instagram.com/trendify_sa'
    },
    {
      icon: MapPin,
      title: isRTL ? 'الموقع' : 'Location',
      value: isRTL ? contactInfo.address_ar : contactInfo.address_en,
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactInfoData.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="border-0 shadow-card bg-card-gradient">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-primary hover:text-secondary transition-colors duration-200 break-words"
                              dir="ltr"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground break-words">{info.value}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-hero bg-card-gradient">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gradient-primary">
                  {isRTL ? 'تابعنا على وسائل التواصل' : 'Follow Us on Social Media'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {socialLinksData.length > 0 ? (
                    socialLinksData.map((social, index) => {
                      const IconComponent = social!.icon;
                      return (
                        <a
                          key={index}
                          href={social!.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                          <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium capitalize">{social!.label}</span>
                        </a>
                      );
                    })
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">
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
