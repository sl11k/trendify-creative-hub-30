import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlogs } from '@/hooks/useBlogs';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';

const Blog = () => {
  usePageTracking(); // Track page views
  const { t, isRTL } = useLanguage();
  const { blogs, loading, error } = useBlogs();

  console.log('Blog page render - Loading:', loading, 'Error:', error, 'Blogs count:', blogs?.length);
  console.log('First 2 blogs:', blogs?.slice(0, 2));

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-lg">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.log('Showing error screen:', error);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-destructive">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log('Rendering main blog page with', blogs.length, 'blogs');

  return (
    <div className="min-h-screen bg-background">
      <SeoHead lang="ar" />
      <Analytics />
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary mb-6">
                {isRTL ? 'مدونتنا' : 'Our Blog'}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {isRTL ? 'اكتشف أحدث المقالات والنصائح في عالم التسويق الرقمي والتطوير والتصميم' : 'Discover the latest articles and tips in digital marketing, development and design'}
              </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-lg text-muted-foreground">
                    {isRTL ? 'لا توجد مقالات متاحة حالياً' : 'No articles available at the moment'}
                  </p>
                </div>
              ) : (
                blogs.map((post, index) => {
                  console.log('Rendering blog post:', post.id, index);
                  return (
                <Card
                  key={post.id}
                  className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image_url || '/placeholder.svg'}
                      alt={isRTL ? post.title_ar : post.title_en}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
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
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                      {isRTL ? post.excerpt_ar : post.excerpt_en}
                    </CardDescription>
                    <a href={`/blog/${post.id}`} className="w-full">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between group-hover:text-primary transition-colors p-0"
                      >
                        <span>{isRTL ? 'اقرأ المزيد' : 'Read More'}</span>
                        <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
                  );
                })
              )}
            </div>

            {/* Newsletter Section */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white shadow-hero max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {isRTL ? 'اشترك في نشرتنا البريدية' : 'Subscribe to Our Newsletter'}
                </h3>
                <p className="text-lg mb-6 text-white/90">
                  {isRTL ? 'احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني' : 'Get the latest articles and tips delivered directly to your inbox'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your email address'}
                    className="flex-1 px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold whitespace-nowrap">
                    {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;