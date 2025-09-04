import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';

const BlogDetail = () => {
  usePageTracking(); // Track page views
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (err) {
      console.error('Error loading blog:', err);
      setError(isRTL ? 'خطأ في تحميل المقال' : 'Error loading blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="mr-2">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-destructive text-lg mb-4">
                {error || (isRTL ? 'المقال غير موجود' : 'Blog post not found')}
              </p>
              <Button onClick={() => navigate('/blog')}>
                {isRTL ? 'العودة للمدونة' : 'Back to Blog'}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = isRTL ? blog.title_ar : blog.title_en;
  const content = isRTL ? blog.content_ar : blog.content_en;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead lang={isRTL ? "ar" : "en"} />
      <Analytics />
      <Header />
      
      <main className="pt-16">
        <article className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/blog')}
                className="group text-muted-foreground hover:text-primary"
              >
                {isRTL ? (
                  <>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    العودة للمدونة
                  </>
                ) : (
                  <>
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                  </>
                )}
              </Button>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-6">
                <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {isRTL ? 'مدونة' : 'Blog'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6 leading-tight">
                {title}
              </h1>
              
              <div className="flex items-center text-muted-foreground gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(blog.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{isRTL ? 'وقت القراءة: 5 دقائق' : 'Reading time: 5 minutes'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{isRTL ? 'فريق Trendify' : 'Trendify Team'}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {blog.image_url && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={blog.image_url} 
                  alt={title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <Card className="border-0 shadow-card bg-card-gradient">
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            {(isRTL ? blog.keywords_ar : blog.keywords_en) && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  {isRTL ? 'الكلمات المفتاحية:' : 'Tags:'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(isRTL ? blog.keywords_ar : blog.keywords_en).map((keyword: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex justify-between items-center">
                <Button onClick={() => navigate('/blog')} className="gap-2">
                  {isRTL ? (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      جميع المقالات
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="h-4 w-4" />
                      All Articles
                    </>
                  )}
                </Button>
                
                <Button onClick={() => navigate('/contact')} variant="outline" className="gap-2">
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;