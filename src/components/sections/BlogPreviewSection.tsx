import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const BlogPreviewSection = () => {
  const { t, isRTL } = useLanguage();
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
        .limit(2);
      
      if (data) {
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  };

  // Fallback content when no blogs are available
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'مدونتنا' : 'Our Blog'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'اطلع على أحدث المقالات والنصائح في عالم التكنولوجيا' : 'Check out the latest articles and tips in the tech world'}
          </p>
        </div>

        {/* Featured Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {displayPosts.map((post, index) => (
            <Card
              key={post.id}
              className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105 stagger-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={isRTL ? post.title_ar : post.title_en}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-hero flex items-center justify-center">
                    <div className="text-white text-6xl font-bold opacity-20">
                      {isRTL ? 'مق' : 'B'}
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {isRTL ? 'مدونة' : 'Blog'}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center text-xs text-muted-foreground mb-2 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{isRTL ? '5 دقائق' : '5 min read'}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {isRTL ? post.title_ar : post.title_en}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-muted-foreground line-clamp-3">
                  {isRTL ? (post.excerpt_ar || post.title_ar) : (post.excerpt_en || post.title_en)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/blog">
            <Button 
              size="xl" 
              className="group bg-secondary hover:bg-secondary-hover transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              {isRTL ? 'اقرأ المزيد من المقالات' : 'Read More Articles'}
              <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;