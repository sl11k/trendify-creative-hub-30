import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const { t, isRTL } = useLanguage();

  const blogPosts = [
    {
      title: isRTL ? 'اتجاهات التسويق الرقمي في 2024' : 'Digital Marketing Trends in 2024',
      excerpt: isRTL ? 'اكتشف أحدث اتجاهات التسويق الرقمي وكيفية الاستفادة منها لتنمية عملك' : 'Discover the latest digital marketing trends and how to leverage them for business growth',
      image: '/placeholder.svg',
      author: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      date: '2024-01-15',
      readTime: isRTL ? '5 دقائق' : '5 min read',
      category: isRTL ? 'التسويق الرقمي' : 'Digital Marketing'
    },
    {
      title: isRTL ? 'أساسيات تطوير المواقع الحديثة' : 'Modern Web Development Fundamentals',
      excerpt: isRTL ? 'دليل شامل لأساسيات تطوير المواقع الحديثة والتقنيات المستخدمة' : 'Comprehensive guide to modern web development fundamentals and technologies',
      image: '/placeholder.svg',
      author: isRTL ? 'سارة أحمد' : 'Sara Ahmed',
      date: '2024-01-12',
      readTime: isRTL ? '8 دقائق' : '8 min read',
      category: isRTL ? 'تطوير الويب' : 'Web Development'
    },
    {
      title: isRTL ? 'أهمية التصميم في تجربة المستخدم' : 'The Importance of Design in User Experience',
      excerpt: isRTL ? 'كيف يؤثر التصميم الجيد على تجربة المستخدم ونجاح المنتج الرقمي' : 'How good design impacts user experience and digital product success',
      image: '/placeholder.svg',
      author: isRTL ? 'محمد علي' : 'Mohamed Ali',
      date: '2024-01-10',
      readTime: isRTL ? '6 دقائق' : '6 min read',
      category: isRTL ? 'التصميم' : 'Design'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
              {blogPosts.map((post, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center text-xs text-muted-foreground mb-2 gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group-hover:text-primary transition-colors p-0"
                    >
                      <span>{isRTL ? 'اقرأ المزيد' : 'Read More'}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
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