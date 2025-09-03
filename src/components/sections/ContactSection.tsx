import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@trendify.agency',
    phone: '+966 50 123 4567',
    address_ar: 'الرياض، المملكة العربية السعودية',
    address_en: 'Riyadh, Saudi Arabia'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    loadContactInfo();
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

  const services = [
    'services.digital-marketing.title',
    'services.web-dev.title',
    'services.graphic-design.title',
    'services.photography.title',
    'services.social-media.title',
    'services.content-writing.title'
  ];

  const contactInfoData = [
    {
      icon: Mail,
      title: isRTL ? 'البريد الإلكتروني' : 'Email',
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`
    },
    {
      icon: Phone,
      title: isRTL ? 'الهاتف' : 'Phone',
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone.replace(/\s/g, '')}`
    },
    {
      icon: MessageSquare,
      title: isRTL ? 'واتساب' : 'WhatsApp',
      value: contactInfo.phone,
      link: `https://wa.me/${contactInfo.phone.replace(/\s|\+/g, '')}`
    },
    {
      icon: MapPin,
      title: isRTL ? 'العنوان' : 'Address',
      value: isRTL ? contactInfo.address_ar : contactInfo.address_en,
      link: null
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: isRTL ? 'خطأ في النموذج' : 'Form Error',
        description: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Here you would typically send the data to your backend
    toast({
      title: isRTL ? 'تم إرسال الرسالة بنجاح!' : 'Message Sent Successfully!',
      description: isRTL ? 'سنتواصل معك قريباً' : 'We will contact you soon',
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-hero bg-card-gradient">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gradient-primary">
                  {isRTL ? 'أرسل لنا رسالة' : 'Send us a Message'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.name')} *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={t('contact.form.name')}
                        required
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('contact.form.email')}
                        required
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.phone')}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('contact.form.phone')}
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.service')}
                      </label>
                      <Select onValueChange={(value) => handleInputChange('service', value)}>
                        <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
                          <SelectValue placeholder={t('contact.form.service')} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service, index) => (
                            <SelectItem key={index} value={service}>
                              {t(service)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={t('contact.form.message')}
                      rows={5}
                      required
                      className="transition-all duration-200 focus:shadow-glow"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 transform hover:scale-105 shadow-glow font-semibold"
                  >
                    {t('contact.form.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;