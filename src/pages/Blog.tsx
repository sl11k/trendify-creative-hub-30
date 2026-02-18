import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { Link } from 'react-router-dom';

const Blog = () => {
  usePageTracking();
  const { t, isRTL } = useLanguage();
  const { blogs, loading, error } = useBlogs();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead lang="ar" />
      <Analytics />
      <Header />
      <main className="pt-16">
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                {isRTL ? 'المدونة' : 'BLOG'}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                {isRTL ? 'أحدث المقالات' : 'Latest Articles'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {isRTL ? 'اكتشف أحدث المقالات والنصائح في عالم التسويق الرقمي والتطوير' : 'Discover the latest articles and tips in digital marketing and development'}
              </p>
            </div>

            {/* Blog Grid */}
            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {isRTL ? 'لا توجد مقالات متاحة حالياً' : 'No articles available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((post) => (
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
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {isRTL ? post.excerpt_ar : post.excerpt_en}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                          {isRTL ? 'اقرأ المزيد' : 'Read more'}
                          <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
