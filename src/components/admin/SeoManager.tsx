import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Search, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface SeoData {
  id?: string;
  page_slug: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  keywords_ar?: string[];
  keywords_en?: string[];
  canonical_url?: string;
  og_image_url?: string;
}

const SeoManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState<SeoData[]>([]);
  const [selectedPage, setSelectedPage] = useState<SeoData | null>(null);
  const [keywordInput, setKeywordInput] = useState({ ar: '', en: '' });

  const defaultPages = [
    { slug: 'home', name_ar: 'الصفحة الرئيسية', name_en: 'Home Page' },
    { slug: 'about', name_ar: 'من نحن', name_en: 'About Us' },
    { slug: 'services', name_ar: 'الخدمات', name_en: 'Services' },
    { slug: 'portfolio', name_ar: 'أعمالنا', name_en: 'Portfolio' },
    { slug: 'blog', name_ar: 'المدونة', name_en: 'Blog' },
    { slug: 'contact', name_ar: 'تواصل معنا', name_en: 'Contact Us' }
  ];

  useEffect(() => {
    loadSeoData();
  }, []);

  const loadSeoData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_slug');

      if (error) throw error;

      // Ensure all default pages exist
      const existingSlugs = new Set(data?.map(item => item.page_slug) || []);
      const missingPages = defaultPages.filter(page => !existingSlugs.has(page.slug));

      for (const page of missingPages) {
        await supabase.from('page_seo').insert([{
          page_slug: page.slug,
          title_ar: page.name_ar,
          title_en: page.name_en,
          description_ar: '',
          description_en: '',
          keywords_ar: [],
          keywords_en: [],
          canonical_url: '',
          og_image_url: ''
        }]);
      }

      // Reload data if we added missing pages
      if (missingPages.length > 0) {
        const { data: updatedData } = await supabase
          .from('page_seo')
          .select('*')
          .order('page_slug');
        setSeoData(updatedData || []);
      } else {
        setSeoData(data || []);
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في تحميل بيانات السيو' : 'Error loading SEO data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      const { error } = await supabase
        .from('page_seo')
        .upsert([selectedPage]);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ بيانات السيو بنجاح' : 'SEO data saved successfully'
      });

      loadSeoData();
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving SEO data',
        variant: 'destructive'
      });
    }
  };

  const addKeyword = (lang: 'ar' | 'en') => {
    if (!selectedPage || !keywordInput[lang].trim()) return;

    const currentKeywords = selectedPage[`keywords_${lang}`] || [];
    const newKeywords = [...currentKeywords, keywordInput[lang].trim()];

    setSelectedPage({
      ...selectedPage,
      [`keywords_${lang}`]: newKeywords
    });

    setKeywordInput({ ...keywordInput, [lang]: '' });
  };

  const removeKeyword = (lang: 'ar' | 'en', index: number) => {
    if (!selectedPage) return;

    const currentKeywords = selectedPage[`keywords_${lang}`] || [];
    const newKeywords = currentKeywords.filter((_, i) => i !== index);

    setSelectedPage({
      ...selectedPage,
      [`keywords_${lang}`]: newKeywords
    });
  };

  const getPageName = (slug: string) => {
    const page = defaultPages.find(p => p.slug === slug);
    return page ? (isRTL ? page.name_ar : page.name_en) : slug;
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
      <h2 className="text-2xl font-bold">{isRTL ? 'إدارة السيو' : 'SEO Management'}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {isRTL ? 'الصفحات' : 'Pages'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {seoData.map((page) => (
                <Button
                  key={page.id}
                  variant={selectedPage?.id === page.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(page)}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {getPageName(page.page_slug)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Form */}
        <div className="lg:col-span-2">
          {selectedPage ? (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إعدادات السيو لصفحة:' : 'SEO Settings for:'} {getPageName(selectedPage.page_slug)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'العنوان بالعربية' : 'Arabic Title'}</Label>
                    <Input
                      value={selectedPage.title_ar || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title_ar: e.target.value })}
                      placeholder={isRTL ? 'عنوان الصفحة بالعربية' : 'Arabic page title'}
                    />
                  </div>
                  <div>
                    <Label>{isRTL ? 'العنوان بالإنجليزية' : 'English Title'}</Label>
                    <Input
                      value={selectedPage.title_en || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title_en: e.target.value })}
                      placeholder={isRTL ? 'عنوان الصفحة بالإنجليزية' : 'English page title'}
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'الوصف بالعربية' : 'Arabic Description'}</Label>
                    <Textarea
                      value={selectedPage.description_ar || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, description_ar: e.target.value })}
                      placeholder={isRTL ? 'وصف الصفحة بالعربية' : 'Arabic page description'}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>{isRTL ? 'الوصف بالإنجليزية' : 'English Description'}</Label>
                    <Textarea
                      value={selectedPage.description_en || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, description_en: e.target.value })}
                      placeholder={isRTL ? 'وصف الصفحة بالإنجليزية' : 'English page description'}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'الكلمات المفتاحية بالعربية' : 'Arabic Keywords'}</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={keywordInput.ar}
                        onChange={(e) => setKeywordInput({ ...keywordInput, ar: e.target.value })}
                        placeholder={isRTL ? 'أدخل كلمة مفتاحية' : 'Enter keyword'}
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword('ar')}
                      />
                      <Button onClick={() => addKeyword('ar')} size="sm">
                        {isRTL ? 'إضافة' : 'Add'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPage.keywords_ar?.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword('ar', index)}>
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>{isRTL ? 'الكلمات المفتاحية بالإنجليزية' : 'English Keywords'}</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={keywordInput.en}
                        onChange={(e) => setKeywordInput({ ...keywordInput, en: e.target.value })}
                        placeholder={isRTL ? 'أدخل كلمة مفتاحية' : 'Enter keyword'}
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword('en')}
                      />
                      <Button onClick={() => addKeyword('en')} size="sm">
                        {isRTL ? 'إضافة' : 'Add'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPage.keywords_en?.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword('en', index)}>
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'الرابط الأساسي' : 'Canonical URL'}</Label>
                    <Input
                      value={selectedPage.canonical_url || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, canonical_url: e.target.value })}
                      placeholder="https://example.com/page"
                    />
                  </div>
                  <div>
                    <Label>{isRTL ? 'صورة المشاركة' : 'OG Image URL'}</Label>
                    <Input
                      value={selectedPage.og_image_url || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, og_image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isRTL ? 'اختر صفحة لتعديل إعدادات السيو' : 'Select a page to edit SEO settings'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoManager;