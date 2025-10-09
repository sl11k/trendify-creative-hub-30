import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface PageSeo {
  id: string;
  page_slug: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  keywords_ar?: string[];
  keywords_en?: string[];
}

export const AISeoOptimizer = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [optimizingAll, setOptimizingAll] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .order('page_slug');

    if (!error && data) {
      setPages(data);
    }
  };

  const optimizePage = async (page: PageSeo) => {
    setOptimizing(page.id);

    try {
      const { data: seoData, error: aiError } = await supabase.functions.invoke('optimize-seo', {
        body: {
          pageSlug: page.page_slug,
          currentSeo: {
            title_ar: page.title_ar,
            title_en: page.title_en,
            description_ar: page.description_ar,
            description_en: page.description_en
          }
        }
      });

      if (aiError) throw aiError;

      const { error: updateError } = await supabase
        .from('page_seo')
        .update({
          title_ar: seoData.title_ar,
          title_en: seoData.title_en,
          description_ar: seoData.description_ar,
          description_en: seoData.description_en,
          keywords_ar: seoData.keywords_ar,
          keywords_en: seoData.keywords_en,
          canonical_url: seoData.canonical_url
        })
        .eq('id', page.id);

      if (updateError) throw updateError;

      toast({
        title: 'تم التحسين بنجاح! ✨',
        description: `تم تحسين SEO لصفحة ${page.page_slug}`
      });

      await loadPages();
    } catch (error: any) {
      console.error('Error optimizing SEO:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ في تحسين SEO',
        variant: 'destructive'
      });
    } finally {
      setOptimizing(null);
    }
  };

  const optimizeAllPages = async () => {
    setOptimizingAll(true);

    try {
      for (const page of pages) {
        await optimizePage(page);
        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: 'اكتمل التحسين! 🎉',
        description: 'تم تحسين SEO لجميع الصفحات بنجاح'
      });
    } catch (error: any) {
      console.error('Error optimizing all pages:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحسين بعض الصفحات',
        variant: 'destructive'
      });
    } finally {
      setOptimizingAll(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          محسّن SEO بالذكاء الاصطناعي
        </CardTitle>
        <CardDescription>
          حسّن SEO لجميع صفحات الموقع تلقائياً بمحتوى احترافي محسّن
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={optimizeAllPages}
          disabled={optimizingAll || pages.length === 0}
          className="w-full mb-4"
        >
          {optimizingAll ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري تحسين جميع الصفحات...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              تحسين جميع الصفحات
            </>
          )}
        </Button>

        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{page.page_slug}</p>
                <p className="text-sm text-muted-foreground">
                  {page.title_ar || page.title_en || 'لا يوجد عنوان'}
                </p>
              </div>
              <Button
                onClick={() => optimizePage(page)}
                disabled={optimizing === page.id || optimizingAll}
                size="sm"
                variant="outline"
              >
                {optimizing === page.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    تحسين
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          💡 سيتم تحسين العناوين، الأوصاف، والكلمات المفتاحية لكل صفحة بشكل احترافي
        </p>
      </CardContent>
    </Card>
  );
};
