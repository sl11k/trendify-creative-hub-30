import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const AIBlogGenerator = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال موضوع المقالة',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate blog content
      toast({
        title: 'جاري التوليد...',
        description: 'يتم إنشاء محتوى المقالة بواسطة AI'
      });

      const { data: blogData, error: blogError } = await supabase.functions.invoke('generate-blog-post', {
        body: { topic }
      });

      if (blogError) throw blogError;

      // Generate image
      toast({
        title: 'جاري توليد الصورة...',
        description: 'يتم إنشاء صورة احترافية للمقالة'
      });

      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-blog-image', {
        body: { prompt: blogData.image_prompt }
      });

      if (imageError) throw imageError;

      // Save to database
      const { error: insertError } = await supabase
        .from('blogs')
        .insert({
          title_ar: blogData.title_ar,
          title_en: blogData.title_en,
          excerpt_ar: blogData.excerpt_ar,
          excerpt_en: blogData.excerpt_en,
          content_ar: blogData.content_ar,
          content_en: blogData.content_en,
          keywords_ar: blogData.keywords_ar,
          keywords_en: blogData.keywords_en,
          meta_description_ar: blogData.meta_description_ar,
          meta_description_en: blogData.meta_description_en,
          image_url: imageData.imageUrl,
          published: autoPublish
        });

      if (insertError) throw insertError;

      toast({
        title: 'تم بنجاح! ✨',
        description: autoPublish 
          ? 'تم إنشاء ونشر المقالة بنجاح'
          : 'تم إنشاء المقالة بنجاح. يمكنك مراجعتها ونشرها من قسم المدونات'
      });

      setTopic('');
    } catch (error: any) {
      console.error('Error generating blog:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ في توليد المقالة',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          مولد المقالات بالذكاء الاصطناعي
        </CardTitle>
        <CardDescription>
          أنشئ مقالات احترافية كاملة مع الصور والكلمات المفتاحية تلقائياً
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">موضوع المقالة</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: أهمية التحول الرقمي للشركات الناشئة"
            disabled={isGenerating}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-publish">نشر تلقائي</Label>
          <Switch
            id="auto-publish"
            checked={autoPublish}
            onCheckedChange={setAutoPublish}
            disabled={isGenerating}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الإنشاء...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              إنشاء مقالة بالذكاء الاصطناعي
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground">
          💡 سيتم إنشاء المحتوى بالعربية والإنجليزية مع صورة احترافية وكلمات مفتاحية محسّنة لمحركات البحث
        </p>
      </CardContent>
    </Card>
  );
};
