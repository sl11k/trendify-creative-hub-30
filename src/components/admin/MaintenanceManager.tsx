import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Settings, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MaintenanceManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [messageAr, setMessageAr] = useState('الموقع مغلق مؤقتاً للصيانة. نعتذر عن الإزعاج وسنعود قريباً.');
  const [messageEn, setMessageEn] = useState('Site is temporarily closed for maintenance. We apologize for the inconvenience and will be back soon.');

  useEffect(() => {
    loadMaintenanceSettings();
  }, []);

  const loadMaintenanceSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['maintenance_mode', 'maintenance_message_ar', 'maintenance_message_en']);
      
      if (error) throw error;
      
      if (data) {
        data.forEach(setting => {
          switch (setting.setting_key) {
            case 'maintenance_mode':
              setMaintenanceMode(setting.setting_value === 'true');
              break;
            case 'maintenance_message_ar':
              setMessageAr(setting.setting_value || messageAr);
              break;
            case 'maintenance_message_en':
              setMessageEn(setting.setting_value || messageEn);
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error loading maintenance settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const settings = [
        { setting_key: 'maintenance_mode', setting_value: maintenanceMode.toString() },
        { setting_key: 'maintenance_message_ar', setting_value: messageAr },
        { setting_key: 'maintenance_message_en', setting_value: messageEn }
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(settings, { onConflict: 'setting_key' });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ إعدادات الصيانة بنجاح' : 'Maintenance settings saved successfully'
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving maintenance settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6" />
        {isRTL ? 'إعدادات وضع الصيانة' : 'Maintenance Mode Settings'}
      </h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {isRTL ? 'وضع الصيانة' : 'Maintenance Mode'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">
                {isRTL ? 'تفعيل وضع الصيانة' : 'Enable Maintenance Mode'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? 'عند التفعيل، سيظهر للزوار صفحة الصيانة بدلاً من الموقع'
                  : 'When enabled, visitors will see a maintenance page instead of the website'
                }
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'رسالة الصيانة بالعربية' : 'Arabic Maintenance Message'}</Label>
              <Textarea
                value={messageAr}
                onChange={(e) => setMessageAr(e.target.value)}
                rows={4}
                placeholder={isRTL ? 'أدخل رسالة الصيانة بالعربية' : 'Enter Arabic maintenance message'}
              />
            </div>
            <div>
              <Label>{isRTL ? 'رسالة الصيانة بالإنجليزية' : 'English Maintenance Message'}</Label>
              <Textarea
                value={messageEn}
                onChange={(e) => setMessageEn(e.target.value)}
                rows={4}
                placeholder={isRTL ? 'أدخل رسالة الصيانة بالإنجليزية' : 'Enter English maintenance message'}
              />
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  {isRTL ? 'تحذير مهم' : 'Important Warning'}
                </h4>
                <p className="text-sm text-yellow-700">
                  {isRTL 
                    ? 'عند تفعيل وضع الصيانة، سيتم منع جميع الزوار من الوصول للموقع. تأكد من إيقاف تشغيله عند انتهاء الصيانة.'
                    : 'When maintenance mode is enabled, all visitors will be prevented from accessing the website. Make sure to disable it when maintenance is complete.'
                  }
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ الإعدادات' : 'Save Settings')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceManager;