import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Trash2, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsCode {
  id: string;
  platform: string;
  code: string;
  active: boolean;
}

const AnalyticsCodesManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyticsCodes, setAnalyticsCodes] = useState<AnalyticsCode[]>([]);

  const platforms = [
    { value: 'google_analytics', label: 'Google Analytics', placeholder: 'G-XXXXXXXXXX' },
    { value: 'google_tag_manager', label: 'Google Tag Manager', placeholder: 'GTM-XXXXXXX' },
    { value: 'meta_pixel', label: 'Meta Pixel (Facebook)', placeholder: '1234567890123456' },
    { value: 'tiktok_pixel', label: 'TikTok Pixel', placeholder: 'C4XXXXXXXXXXXXXXXXXXXXXXXXXX' },
    { value: 'snapchat_pixel', label: 'Snapchat Pixel', placeholder: '12345678-1234-1234-1234-123456789012' }
  ];

  useEffect(() => {
    loadAnalyticsCodes();
  }, []);

  const loadAnalyticsCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analytics_codes')
        .select('*')
        .order('platform');
      
      if (error) throw error;
      setAnalyticsCodes(data || []);
    } catch (error) {
      console.error('Error loading analytics codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (platform: string, code: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('analytics_codes')
        .upsert([{ platform, code, active }], { 
          onConflict: 'platform',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ كود التتبع بنجاح' : 'Analytics code saved successfully'
      });
      
      loadAnalyticsCodes();
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving analytics code',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(isRTL ? 'هل أنت متأكد من حذف كود التتبع هذا؟' : 'Are you sure you want to delete this analytics code?')) {
      try {
        const { error } = await supabase
          .from('analytics_codes')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الحذف بنجاح' : 'Deleted Successfully',
          description: isRTL ? 'تم حذف كود التتبع بنجاح' : 'Analytics code deleted successfully'
        });
        
        loadAnalyticsCodes();
      } catch (error) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'حدث خطأ أثناء الحذف' : 'Error deleting analytics code',
          variant: 'destructive'
        });
      }
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
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        {isRTL ? 'إدارة أكواد التتبع والتحليلات' : 'Analytics & Tracking Codes Management'}
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {platforms.map((platform) => {
          const existingCode = analyticsCodes.find(code => code.platform === platform.value);
          return (
            <Card key={platform.value}>
              <CardHeader>
                <CardTitle>{platform.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{isRTL ? 'رمز التتبع' : 'Tracking Code'}</Label>
                  <Textarea
                    value={existingCode?.code || ''}
                    onChange={(e) => {
                      const updatedCodes = analyticsCodes.map(code => 
                        code.platform === platform.value ? { ...code, code: e.target.value } : code
                      );
                      if (!existingCode) {
                        updatedCodes.push({ 
                          id: crypto.randomUUID(), 
                          platform: platform.value, 
                          code: e.target.value, 
                          active: false 
                        });
                      }
                      setAnalyticsCodes(updatedCodes);
                    }}
                    placeholder={platform.placeholder}
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={existingCode?.active || false}
                      onCheckedChange={(checked) => {
                        const updatedCodes = analyticsCodes.map(code => 
                          code.platform === platform.value ? { ...code, active: checked } : code
                        );
                        if (!existingCode) {
                          updatedCodes.push({ 
                            id: crypto.randomUUID(), 
                            platform: platform.value, 
                            code: '', 
                            active: checked 
                          });
                        }
                        setAnalyticsCodes(updatedCodes);
                      }}
                    />
                    <Label>{isRTL ? 'نشط' : 'Active'}</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave(platform.value, existingCode?.code || '', existingCode?.active || false)}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isRTL ? 'حفظ' : 'Save'}
                    </Button>
                    {existingCode && (
                      <Button
                        onClick={() => handleDelete(existingCode.id)}
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        {isRTL ? 'حذف' : 'Delete'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsCodesManager;