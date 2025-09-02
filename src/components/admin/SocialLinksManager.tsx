import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SocialLinksManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'whatsapp'];

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('social_links').select('*').order('platform');
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error loading social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (platform: string, url: string, active: boolean) => {
    try {
      console.log('Saving social link:', { platform, url, active });
      const { error } = await supabase
        .from('social_links')
        .upsert([{ platform, url, active }], { 
          onConflict: 'platform',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ رابط المنصة بنجاح' : 'Social link saved successfully'
      });
      
      loadSocialLinks();
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving social link',
        variant: 'destructive'
      });
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
      <h2 className="text-2xl font-bold">{isRTL ? 'إدارة وسائل التواصل' : 'Social Media Management'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const link = socialLinks.find(l => l.platform === platform);
          return (
            <Card key={platform}>
              <CardHeader>
                <CardTitle className="capitalize">{platform}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{isRTL ? 'الرابط' : 'URL'}</Label>
                  <Input
                    value={link?.url || ''}
                    onChange={(e) => {
                      const updatedLinks = socialLinks.map(l => 
                        l.platform === platform ? { ...l, url: e.target.value } : l
                      );
                      if (!link) {
                        updatedLinks.push({ platform, url: e.target.value, active: false });
                      }
                      setSocialLinks(updatedLinks);
                    }}
                    placeholder={`https://${platform}.com/username`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={link?.active || false}
                      onCheckedChange={(checked) => {
                        const updatedLinks = socialLinks.map(l => 
                          l.platform === platform ? { ...l, active: checked } : l
                        );
                        if (!link) {
                          updatedLinks.push({ platform, url: '', active: checked });
                        }
                        setSocialLinks(updatedLinks);
                      }}
                    />
                    <Label>{isRTL ? 'نشط' : 'Active'}</Label>
                  </div>
                  <Button
                    onClick={() => handleSave(platform, link?.url || '', link?.active || false)}
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isRTL ? 'حفظ' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksManager;