import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Settings, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  consultation_button_text_ar: string;
  consultation_button_text_en: string;
  consultation_button_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address_ar: string;
  contact_address_en: string;
  site_title_ar: string;
  site_title_en: string;
  site_description_ar: string;
  site_description_en: string;
}

const SiteSettingsManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    consultation_button_text_ar: 'احصل على استشارة مجانية',
    consultation_button_text_en: 'Get Free Consultation',
    consultation_button_url: '/contact',
    contact_email: 'hello@trendify.agency',
    contact_phone: '+966 50 123 4567',
    contact_address_ar: 'الرياض، المملكة العربية السعودية',
    contact_address_en: 'Riyadh, Saudi Arabia',
    site_title_ar: 'تريندفاي - وكالة التسويق الرقمي',
    site_title_en: 'Trendify - Digital Marketing Agency',
    site_description_ar: 'نقدم خدمات التسويق الرقمي والتطوير والتصميم',
    site_description_en: 'We provide digital marketing, development and design services'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsObj = data.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value || '';
          return acc;
        }, {} as Record<string, string>);

        setSettings(prev => ({
          ...prev,
          ...settingsObj
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في تحميل الإعدادات' : 'Error loading settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert settings object to array format for upsert
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      console.log('Saving settings:', settingsArray);
      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsArray, { 
          onConflict: 'setting_key',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ إعدادات الموقع بنجاح' : 'Site settings saved successfully'
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{isRTL ? 'إعدادات الموقع' : 'Site Settings'}</h2>
      
      {/* Consultation Button Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            {isRTL ? 'زر الاستشارة المجانية' : 'Consultation Button'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'تحكم في نص ورابط زر الاستشارة المجانية في الصفحة الرئيسية' : 'Control the text and link of the consultation button on the homepage'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'النص بالعربية' : 'Arabic Text'}</Label>
              <Input
                value={settings.consultation_button_text_ar}
                onChange={(e) => handleInputChange('consultation_button_text_ar', e.target.value)}
                placeholder={isRTL ? 'احصل على استشارة مجانية' : 'Arabic button text'}
              />
            </div>
            <div>
              <Label>{isRTL ? 'النص بالإنجليزية' : 'English Text'}</Label>
              <Input
                value={settings.consultation_button_text_en}
                onChange={(e) => handleInputChange('consultation_button_text_en', e.target.value)}
                placeholder={isRTL ? 'النص بالإنجليزية' : 'Get Free Consultation'}
              />
            </div>
          </div>
          <div>
            <Label>{isRTL ? 'رابط الزر' : 'Button URL'}</Label>
            <Input
              value={settings.consultation_button_url}
              onChange={(e) => handleInputChange('consultation_button_url', e.target.value)}
              placeholder="/contact"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {isRTL ? 'معلومات التواصل' : 'Contact Information'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'معلومات التواصل التي تظهر في الفوتر' : 'Contact information displayed in the footer'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input
                value={settings.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="hello@trendify.agency"
                type="email"
              />
            </div>
            <div>
              <Label>{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input
                value={settings.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+966 50 123 4567"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'العنوان بالعربية' : 'Arabic Address'}</Label>
              <Textarea
                value={settings.contact_address_ar}
                onChange={(e) => handleInputChange('contact_address_ar', e.target.value)}
                placeholder={isRTL ? 'الرياض، المملكة العربية السعودية' : 'Arabic address'}
                rows={2}
              />
            </div>
            <div>
              <Label>{isRTL ? 'العنوان بالإنجليزية' : 'English Address'}</Label>
              <Textarea
                value={settings.contact_address_en}
                onChange={(e) => handleInputChange('contact_address_en', e.target.value)}
                placeholder={isRTL ? 'العنوان بالإنجليزية' : 'Riyadh, Saudi Arabia'}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {isRTL ? 'معلومات الموقع' : 'Site Information'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'العنوان والوصف العام للموقع' : 'General site title and description'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'عنوان الموقع بالعربية' : 'Arabic Site Title'}</Label>
              <Input
                value={settings.site_title_ar}
                onChange={(e) => handleInputChange('site_title_ar', e.target.value)}
                placeholder={isRTL ? 'تريندفاي - وكالة التسويق الرقمي' : 'Arabic site title'}
              />
            </div>
            <div>
              <Label>{isRTL ? 'عنوان الموقع بالإنجليزية' : 'English Site Title'}</Label>
              <Input
                value={settings.site_title_en}
                onChange={(e) => handleInputChange('site_title_en', e.target.value)}
                placeholder={isRTL ? 'العنوان بالإنجليزية' : 'Trendify - Digital Marketing Agency'}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'وصف الموقع بالعربية' : 'Arabic Site Description'}</Label>
              <Textarea
                value={settings.site_description_ar}
                onChange={(e) => handleInputChange('site_description_ar', e.target.value)}
                placeholder={isRTL ? 'نقدم خدمات التسويق الرقمي والتطوير والتصميم' : 'Arabic site description'}
                rows={3}
              />
            </div>
            <div>
              <Label>{isRTL ? 'وصف الموقع بالإنجليزية' : 'English Site Description'}</Label>
              <Textarea
                value={settings.site_description_en}
                onChange={(e) => handleInputChange('site_description_en', e.target.value)}
                placeholder={isRTL ? 'الوصف بالإنجليزية' : 'We provide digital marketing, development and design services'}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
      </Button>
    </div>
  );
};

export default SiteSettingsManager;