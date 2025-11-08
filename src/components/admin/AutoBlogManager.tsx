import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AutoBlogManager = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'auto_blog_enabled')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setIsEnabled(data.setting_value === 'true');
      }

      // Load last run info
      const { data: lastBlog } = await supabase
        .from('blogs')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastBlog) {
        setLastRun(new Date(lastBlog.created_at).toLocaleString('ar-SA'));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const testGeneration = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-generate-blog', {
        body: {}
      });

      if (error) throw error;

      toast({
        title: 'تم توليد المقالة بنجاح! ✨',
        description: `عنوان المقالة: ${data.blog.title_ar}`,
      });
      
      setLastRun(new Date().toLocaleString('ar-SA'));
    } catch (error: any) {
      console.error('Test generation error:', error);
      toast({
        title: 'خطأ في التوليد',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoGeneration = async (enabled: boolean) => {
    try {
      // Save to database
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'auto_blog_enabled',
          setting_value: enabled ? 'true' : 'false'
        });

      if (error) throw error;

      setIsEnabled(enabled);
      
      if (enabled) {
        toast({
          title: 'تم تفعيل التوليد التلقائي ✅',
          description: 'سيتم توليد مقالة جديدة كل 24 ساعة تلقائياً',
        });
      } else {
        toast({
          title: 'تم إيقاف التوليد التلقائي',
          description: 'لن يتم توليد مقالات جديدة تلقائياً',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error toggling auto generation:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          توليد مقالات تلقائية بالذكاء الاصطناعي
        </CardTitle>
        <CardDescription>
          نظام ذكي يولد وينشر مقالات SEO محسّنة تلقائياً كل 24 ساعة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loadingSettings ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Status */}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {isEnabled ? (
                  <span className="text-green-600 font-medium">
                    ✅ التوليد التلقائي مفعّل - مقالة جديدة كل 24 ساعة
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">
                    ⏸️ التوليد التلقائي متوقف
                  </span>
                )}
              </AlertDescription>
            </Alert>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="auto-generation" className="text-base font-medium">
              تفعيل التوليد التلقائي
            </Label>
            <p className="text-sm text-muted-foreground">
              سيتم توليد مقالة جديدة كل 24 ساعة في الساعة 9 صباحاً
            </p>
          </div>
          <Switch
            id="auto-generation"
            checked={isEnabled}
            onCheckedChange={toggleAutoGeneration}
          />
        </div>

        {/* Last Run Info */}
        {lastRun && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">
              آخر مقالة تم توليدها: {lastRun}
            </span>
          </div>
        )}

        {/* Test Generation */}
        <div className="space-y-3">
          <Label className="text-base">تجربة التوليد</Label>
          <p className="text-sm text-muted-foreground">
            اختبر النظام بتوليد مقالة الآن (سيتم نشرها مباشرة)
          </p>
          <Button 
            onClick={testGeneration} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري توليد المقالة...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                توليد مقالة تجريبية الآن
              </>
            )}
          </Button>
        </div>

        {/* Features List */}
        <div className="space-y-2 p-4 bg-primary/5 rounded-lg">
          <h4 className="font-semibold mb-3">✨ ماذا يفعل النظام؟</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>يختار موضوع ذكي من 10+ مواضيع متعلقة بخدمات Trendify</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>يولد مقالة شاملة 1500-2000 كلمة محسّنة لـ SEO</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>يولد صورة مميزة احترافية بالذكاء الاصطناعي</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>ينشر المقالة تلقائياً في المدونة</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>يضيف Keywords وMeta Description محسّنة</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>محتوى بالعربية والإنجليزية لتحسين الوصول</span>
            </li>
          </ul>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>ملاحظة مهمة:</strong> لتفعيل التوليد التلقائي كل 24 ساعة، تحتاج لإعداد Cron Job في Supabase. 
            راجع التعليمات في لوحة Supabase → SQL Editor.
          </AlertDescription>
        </Alert>
        </>
        )}
      </CardContent>
    </Card>
  );
};
