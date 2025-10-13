import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from './AdminSidebar';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));
const SeoManager = lazy(() => import('./SeoManager'));
const ServicesManager = lazy(() => import('./ServicesManager'));
const SocialLinksManager = lazy(() => import('./SocialLinksManager'));
const WhatsAppButtonManager = lazy(() => import('./WhatsAppButtonManager'));
const BlogManager = lazy(() => import('./BlogManager'));
const SiteSettingsManager = lazy(() => import('./SiteSettingsManager'));
const AnalyticsCodesManager = lazy(() => import('./AnalyticsCodesManager'));
const UsersManager = lazy(() => import('./UsersManager'));
const MaintenanceManager = lazy(() => import('./MaintenanceManager'));
const PortfolioManager = lazy(() => import('./PortfolioManager'));
const PartnersManager = lazy(() => import('./PartnersManager'));
const ToolsManager = lazy(() => import('./ToolsManager'));
const AIBlogGenerator = lazy(() => import('./AIBlogGenerator').then(m => ({ default: m.AIBlogGenerator })));
const AISeoOptimizer = lazy(() => import('./AISeoOptimizer').then(m => ({ default: m.AISeoOptimizer })));

// Types
interface Blog {
  id: string;
  title_ar: string;
  title_en: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  content_ar: string;
  content_en: string;
  image_url?: string;
  published: boolean;
  keywords_ar?: string[];
  keywords_en?: string[];
  meta_description_ar?: string;
  meta_description_en?: string;
  canonical_url?: string;
  created_at: string;
}

interface Portfolio {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  project_url?: string;
  category?: string;
  technologies?: string[];
  published: boolean;
  created_at: string;
}

interface Service {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  icon_name?: string;
  gradient_from?: string;
  gradient_to?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url?: string;
  active: boolean;
  created_at: string;
}

interface AnalyticsCode {
  id: string;
  platform: string;
  code: string;
  active: boolean;
  created_at: string;
}

interface PageSEO {
  id: string;
  page_slug: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  keywords_ar?: string[];
  keywords_en?: string[];
  og_image_url?: string;
  canonical_url?: string;
  created_at: string;
}

interface DailyStats {
  id: string;
  date: string;
  total_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [analyticsCodes, setAnalyticsCodes] = useState<AnalyticsCode[]>([]);
  const [pageSEO, setPageSEO] = useState<PageSEO[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load data only when needed for overview
    if (activeTab === 'overview') {
      loadOverviewData();
    }
  }, [activeTab]);

  const loadOverviewData = async () => {
    try {
      // Load only counts for overview
      const [blogsData, portfolioData, servicesData, socialLinksData] = await Promise.all([
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('portfolio').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('social_links').select('id', { count: 'exact', head: true })
      ]);

      setBlogs(Array(blogsData.count || 0).fill({}));
      setPortfolio(Array(portfolioData.count || 0).fill({}));
      setServices(Array(servicesData.count || 0).fill({}));
      setSocialLinks(Array(socialLinksData.count || 0).fill({}));
    } catch (error) {
      console.error('Error loading overview data:', error);
    }
  };

  // Overview dashboard content
  const OverviewDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary">النظرة العامة</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة التحكم</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-primary p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold">المقالات</h3>
          <p className="text-3xl font-bold">{blogs.length}</p>
          <p className="text-sm opacity-80">إجمالي المقالات</p>
        </div>
        
        <div className="bg-gradient-secondary p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold">المشاريع</h3>
          <p className="text-3xl font-bold">{portfolio.length}</p>
          <p className="text-sm opacity-80">إجمالي المشاريع</p>
        </div>
        
        <div className="bg-gradient-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-foreground">الخدمات</h3>
          <p className="text-3xl font-bold text-primary">{services.length}</p>
          <p className="text-sm text-muted-foreground">إجمالي الخدمات</p>
        </div>
        
        <div className="bg-gradient-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-foreground">المنصات الاجتماعية</h3>
          <p className="text-3xl font-bold text-accent">{socialLinks.length}</p>
          <p className="text-sm text-muted-foreground">روابط نشطة</p>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  );

  const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const renderTabContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'overview':
          return <OverviewDashboard />;
        case 'analytics':
          return <AnalyticsDashboard />;
        case 'analytics-codes':
          return <AnalyticsCodesManager />;
        case 'seo':
          return <SeoManager />;
        case 'ai-blog':
          return (
            <div className="space-y-6">
              <AIBlogGenerator />
              <BlogManager />
            </div>
          );
        case 'ai-seo':
          return <AISeoOptimizer />;
        case 'blogs':
          return <BlogManager />;
        case 'portfolio':
          return <PortfolioManager />;
        case 'partners':
          return <PartnersManager />;
        case 'tools':
          return <ToolsManager />;
        case 'services':
          return <ServicesManager />;
        case 'social-links':
          return <SocialLinksManager />;
        case 'whatsapp':
          return <WhatsAppButtonManager />;
        case 'site-settings':
          return <SiteSettingsManager />;
        case 'users':
          return <UsersManager />;
        case 'maintenance':
          return <MaintenanceManager />;
        default:
          return <OverviewDashboard />;
      }
    })();

    return (
      <Suspense fallback={<LoadingFallback />}>
        {content}
      </Suspense>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={onLogout} 
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};