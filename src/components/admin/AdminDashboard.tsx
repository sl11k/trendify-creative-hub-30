import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from './AdminSidebar';

// Import all admin components
import AnalyticsDashboard from './AnalyticsDashboard';
import SeoManager from './SeoManager';
import ServicesManager from './ServicesManager';
import SocialLinksManager from './SocialLinksManager';
import WhatsAppButtonManager from './WhatsAppButtonManager';
import BlogManager from './BlogManager';
import SiteSettingsManager from './SiteSettingsManager';
import AnalyticsCodesManager from './AnalyticsCodesManager';
import UsersManager from './UsersManager';
import MaintenanceManager from './MaintenanceManager';
import { WebsiteBuilder } from './WebsiteBuilder';
import { AdvancedWebsiteBuilder } from './AdvancedWebsiteBuilder';
import { IconManager } from './IconManager';
import { LayoutCustomizer } from './LayoutCustomizer';
import PortfolioManager from './PortfolioManager';
import PartnersManager from './PartnersManager';
import ToolsManager from './ToolsManager';
import { Tables } from '@/integrations/supabase/types';

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
  const [partners, setPartners] = useState<Tables<'partners'>[]>([]);
  const [tools, setTools] = useState<Tables<'tools'>[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [analyticsCodes, setAnalyticsCodes] = useState<AnalyticsCode[]>([]);
  const [pageSEO, setPageSEO] = useState<PageSEO[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load all data in parallel
      const [
        blogsData,
        portfolioData, 
        servicesData,
        partnersData,
        toolsData,
        socialLinksData,
        analyticsData,
        seoData,
        statsData,
        settingsData
      ] = await Promise.all([
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('partners').select('*').order('sort_order', { ascending: true }),
        supabase.from('tools').select('*').order('sort_order', { ascending: true }),
        supabase.from('social_links').select('*').order('created_at', { ascending: false }),
        supabase.from('analytics_codes').select('*').order('created_at', { ascending: false }),
        supabase.from('page_seo').select('*').order('page_slug', { ascending: true }),
        supabase.from('daily_stats').select('*').order('date', { ascending: false }).limit(30),
        supabase.from('site_settings').select('*')
      ]);

      if (blogsData.data) setBlogs(blogsData.data);
      if (portfolioData.data) setPortfolio(portfolioData.data);
      if (servicesData.data) setServices(servicesData.data);
      if (partnersData.data) setPartners(partnersData.data);
      if (toolsData.data) setTools(toolsData.data);
      if (socialLinksData.data) setSocialLinks(socialLinksData.data);
      if (analyticsData.data) setAnalyticsCodes(analyticsData.data);
      if (seoData.data) setPageSEO(seoData.data);
      if (statsData.data) setDailyStats(statsData.data);
      
      if (settingsData.data) {
        const settings = settingsData.data.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value || '';
          return acc;
        }, {} as Record<string, string>);
        setSiteSettings(settings);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'حدث خطأ أثناء تحميل البيانات',
        variant: 'destructive',
      });
    }
  };

  // Overview dashboard content
  const OverviewDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary">النظرة العامة</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة التحكم</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h3 className="text-lg font-semibold text-foreground">الشركاء</h3>
          <p className="text-3xl font-bold text-primary">{partners.length}</p>
          <p className="text-sm text-muted-foreground">شركاء النجاح</p>
        </div>
        
        <div className="bg-gradient-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-foreground">الأدوات</h3>
          <p className="text-3xl font-bold text-primary">{tools.length}</p>
          <p className="text-sm text-muted-foreground">أدوات مفيدة</p>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'analytics-codes':
        return <AnalyticsCodesManager />;
      case 'seo':
        return <SeoManager />;
      case 'blogs':
        return <BlogManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'services':
        return <ServicesManager />;
      case 'partners':
        return <PartnersManager partners={partners} onRefresh={loadAllData} />;
      case 'tools':
        return <ToolsManager tools={tools} onRefresh={loadAllData} />;
      case 'social-links':
        return <SocialLinksManager />;
      case 'whatsapp':
        return <WhatsAppButtonManager />;
      case 'website-builder':
        return <AdvancedWebsiteBuilder />;
      case 'icon-manager':
        return <IconManager />;
      case 'layout-customizer':
        return <LayoutCustomizer />;
      case 'site-settings':
        return <SiteSettingsManager />;
      case 'users':
        return <UsersManager />;
      case 'maintenance':
        return <MaintenanceManager />;
      default:
        return <OverviewDashboard />;
    }
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