import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const BlogPreviewSection = () => {
  const { isRTL } = useLanguage();
  const headerRef = useScrollAnimation();
  const gridRef = useStaggerAnimation();
  const [blogs, setBlogs] = useState<Array<{
    id: string;
    title_ar: string;
    title_en: string;
    excerpt_ar?: string;
    excerpt_en?: string;
    image_url?: string;
    created_at: string;
  }>>([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  };

  const fallbackPosts = [
    {
      id: '1',
      title_ar: 'اتجاهات التسويق الرقمي في 2024',
      title_en: 'Digital Marketing Trends in 2024',
      excerpt_ar: 'اكتشف أحدث اتجاهات التسويق الرقمي وكيفية الاستفادة منها',
      excerpt_en: 'Discover the latest digital marketing trends and how to leverage them',
      created_at: '2024-01-15T00:00:00.000Z',
      image_url: null
    },
    {
      id: '2',
      title_ar: 'أساسيات تطوير المواقع الحديثة',
      title_en: 'Modern Web Development Fundamentals',
      excerpt_ar: 'دليل شامل لأساسيات تطوير المواقع الحديثة والتقنيات المستخدمة',
      excerpt_en: 'Comprehensive guide to modern web development fundamentals',
      created_at: '2024-01-12T00:00:00.000Z',
      image_url: null
    }
  ];

  const displayPosts = blogs.length > 0 ? blogs : fallbackPosts;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 scroll-hidden">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'المدونة' : 'BLOG'}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {isRTL ? 'أحدث المقالات' : 'Latest Articles'}
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 stagger-container">
          {displayPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <Card className="group border border-border/50 bg-background hover:border-primary/30 transition-all duration-300 overflow-hidden h-full">
                <div className="relative overflow-hidden aspect-video">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={isRTL ? post.title_ar : post.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground/20">
                        {isRTL ? 'مقال' : 'BLOG'}
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {isRTL ? post.title_ar : post.title_en}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isRTL ? (post.excerpt_ar || post.title_ar) : (post.excerpt_en || post.title_en)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {isRTL ? 'اقرأ المزيد من المقالات' : 'Read more articles'}
            <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
