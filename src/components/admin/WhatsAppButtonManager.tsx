import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WhatsAppButtonManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    phone: '+966501234567',
    active: false,
    position: 'bottom-right'
  });

  useEffect(() => {
    loadWhatsAppConfig();
  }, []);

  const loadWhatsAppConfig = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('whatsapp_button')
        .select('*')
        .single();
      
      if (data) {
        setConfig({
          phone: data.phone || '+966501234567',
          active: data.active || false,
          position: data.position || 'bottom-right'
        });
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('whatsapp_button')
        .upsert([config], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ إعدادات زر الواتساب بنجاح' : 'WhatsApp button settings saved successfully'
      });
      
    } catch (error) {
      console.error('Error saving WhatsApp config:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving WhatsApp settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">
          {isRTL ? 'إدارة زر الواتساب العائم' : 'Floating WhatsApp Button Management'}
        </h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'إعدادات زر الواتساب' : 'WhatsApp Button Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">
              {isRTL ? 'رقم الواتساب' : 'WhatsApp Number'}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={config.phone}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
              placeholder="+966501234567"
              dir="ltr"
              className="text-left"
            />
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'أدخل رقم الواتساب مع رمز البلد (مثال: +966501234567)'
                : 'Enter WhatsApp number with country code (e.g., +966501234567)'
              }
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="active">
                {isRTL ? 'تفعيل الزر' : 'Enable Button'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? 'عرض زر الواتساب العائم في الموقع'
                  : 'Show floating WhatsApp button on the website'
                }
              </p>
            </div>
            <Switch
              id="active"
              checked={config.active}
              onCheckedChange={(checked) => setConfig({ ...config, active: checked })}
            />
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
            </Button>
          </div>

          {/* Preview */}
          {config.active && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-2">
                {isRTL ? 'معاينة الزر' : 'Button Preview'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span>{isRTL ? 'سيظهر زر الواتساب في أسفل يمين الصفحة' : 'WhatsApp button will appear at bottom-right of the page'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppButtonManager;