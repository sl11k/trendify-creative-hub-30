import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  BarChart, 
  Settings, 
  FileText, 
  Briefcase, 
  Wrench,
  Users,
  Globe,
  TrendingUp,
  Calendar,
  Shield,
  LogOut,
  Save,
  Share2,
  Search,
  MessageCircle
} from 'lucide-react';

// Import components
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import SeoManager from '@/components/admin/SeoManager';
import ServicesManager from '@/components/admin/ServicesManager';
import SocialLinksManager from '@/components/admin/SocialLinksManager';
import WhatsAppButtonManager from '@/components/admin/WhatsAppButtonManager';
import BlogManager from '@/components/admin/BlogManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import AnalyticsCodesManager from '@/components/admin/AnalyticsCodesManager';
import UsersManager from '@/components/admin/UsersManager';
import MaintenanceManager from '@/components/admin/MaintenanceManager';
import { WebsiteBuilder } from '@/components/admin/WebsiteBuilder';

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

const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
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

  // Form states
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<Portfolio> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(null);
  const [editingAnalytics, setEditingAnalytics] = useState<Partial<AnalyticsCode> | null>(null);
  const [editingSEO, setEditingSEO] = useState<Partial<PageSEO> | null>(null);

  // Dialog states
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [seoDialogOpen, setSeoDialogOpen] = useState(false);

  // Available icons for services
  const availableIcons = [
    'Search', 'Code', 'Palette', 'Camera', 'Share2', 'PenTool',
    'MessageCircle', 'Mail', 'Phone', 'Home', 'User', 'Image',
    'Star', 'Hash', 'Link', 'Target', 'Settings', 'Globe'
  ];

  // Social platforms
  const socialPlatforms = [
    'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'WhatsApp', 'TikTok', 'Snapchat'
  ];

  // Analytics platforms
  const analyticsPlatforms = [
    'Google Analytics', 'Google Tag Manager', 'Meta Pixel', 'TikTok Pixel', 'Snapchat Pixel'
  ];

  useEffect(() => {
    // Check for stored auth
    const storedAuth = localStorage.getItem('admin_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedEmail = loginData.email.trim().toLowerCase();
    if (normalizedEmail !== 'm7md4r3al@gmail.com') {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'البريد الإلكتروني غير صحيح',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (loginData.password === 'Nsm123123_') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم'
        });
      } else {
        throw new Error('كلمة المرور غير صحيحة');
      }

    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'كلمة المرور غير صحيحة',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    toast({
      title: 'تم تسجيل الخروج',
      description: 'تم تسجيل خروجك بنجاح'
    });
  };

  const loadAllData = async () => {
    try {
      // Load all data in parallel
      const [
        blogsData,
        portfolioData, 
        servicesData,
        socialLinksData,
        analyticsData,
        seoData,
        statsData,
        settingsData
      ] = await Promise.all([
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('social_links').select('*').order('created_at', { ascending: false }),
        supabase.from('analytics_codes').select('*').order('created_at', { ascending: false }),
        supabase.from('page_seo').select('*').order('page_slug', { ascending: true }),
        supabase.from('daily_stats').select('*').order('date', { ascending: false }).limit(30),
        supabase.from('site_settings').select('*')
      ]);

      if (blogsData.data) setBlogs(blogsData.data);
      if (portfolioData.data) setPortfolio(portfolioData.data);
      if (servicesData.data) setServices(servicesData.data);
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

  // Blog functions
  const saveBlog = async () => {
    if (!editingBlog || !editingBlog.title_ar || !editingBlog.title_en) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء العنوان باللغتين',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (editingBlog.id) {
        await supabase
          .from('blogs')
          .update(editingBlog)
          .eq('id', editingBlog.id);
      } else {
        await supabase
          .from('blogs')
          .insert({
            title_ar: editingBlog.title_ar!,
            title_en: editingBlog.title_en!,
            content_ar: editingBlog.content_ar || '',
            content_en: editingBlog.content_en || '',
            excerpt_ar: editingBlog.excerpt_ar,
            excerpt_en: editingBlog.excerpt_en,
            image_url: editingBlog.image_url,
            published: editingBlog.published || false,
            keywords_ar: editingBlog.keywords_ar,
            keywords_en: editingBlog.keywords_en,
            meta_description_ar: editingBlog.meta_description_ar,
            meta_description_en: editingBlog.meta_description_en,
            canonical_url: editingBlog.canonical_url
          });
      }
      
      setBlogDialogOpen(false);
      setEditingBlog(null);
      loadAllData();
      toast({
        title: 'تم حفظ المدونة بنجاح',
      });
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ المدونة',
        variant: 'destructive',
      });
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await supabase.from('blogs').delete().eq('id', id);
      loadAllData();
      toast({
        title: 'تم حذف المدونة بنجاح',
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: 'خطأ في الحذف',
        variant: 'destructive',
      });
    }
  };

  // Portfolio functions
  const savePortfolio = async () => {
    if (!editingPortfolio || !editingPortfolio.title_ar || !editingPortfolio.title_en) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء العنوان باللغتين',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (editingPortfolio.id) {
        await supabase
          .from('portfolio')
          .update(editingPortfolio)
          .eq('id', editingPortfolio.id);
      } else {
        await supabase
          .from('portfolio')
          .insert({
            title_ar: editingPortfolio.title_ar!,
            title_en: editingPortfolio.title_en!,
            description_ar: editingPortfolio.description_ar,
            description_en: editingPortfolio.description_en,
            image_url: editingPortfolio.image_url,
            project_url: editingPortfolio.project_url,
            category: editingPortfolio.category,
            technologies: editingPortfolio.technologies,
            published: editingPortfolio.published || false
          });
      }
      
      setPortfolioDialogOpen(false);
      setEditingPortfolio(null);
      loadAllData();
      toast({
        title: 'تم حفظ المشروع بنجاح',
      });
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: 'خطأ في الحفظ',
        variant: 'destructive',
      });
    }
  };

  const deletePortfolio = async (id: string) => {
    try {
      await supabase.from('portfolio').delete().eq('id', id);
      loadAllData();
      toast({
        title: 'تم حذف المشروع بنجاح',
      });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: 'خطأ في الحذف',
        variant: 'destructive',
      });
    }
  };

  // Service functions
  const saveService = async () => {
    if (!editingService || !editingService.title_ar || !editingService.title_en) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء العنوان باللغتين',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (editingService.id) {
        await supabase
          .from('services')
          .update(editingService)
          .eq('id', editingService.id);
      } else {
        await supabase
          .from('services')
          .insert({
            title_ar: editingService.title_ar!,
            title_en: editingService.title_en!,
            description_ar: editingService.description_ar,
            description_en: editingService.description_en,
            icon_name: editingService.icon_name,
            gradient_from: editingService.gradient_from,
            gradient_to: editingService.gradient_to,
            sort_order: editingService.sort_order || 0,
            active: editingService.active !== false
          });
      }
      
      setServiceDialogOpen(false);
      setEditingService(null);
      loadAllData();
      toast({
        title: 'تم حفظ الخدمة بنجاح',
      });
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'خطأ في الحفظ',
        variant: 'destructive',
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      await supabase.from('services').delete().eq('id', id);
      loadAllData();
      toast({
        title: 'تم حذف الخدمة بنجاح',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'خطأ في الحذف',
        variant: 'destructive',
      });
    }
  };

  // Social media functions
  const saveSocial = async () => {
    if (!editingSocial || !editingSocial.platform) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المنصة',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (editingSocial.id) {
        await supabase
          .from('social_links')
          .update(editingSocial)
          .eq('id', editingSocial.id);
      } else {
        await supabase
          .from('social_links')
          .insert({
            platform: editingSocial.platform!,
            url: editingSocial.url,
            active: editingSocial.active || false
          });
      }
      
      setSocialDialogOpen(false);
      setEditingSocial(null);
      loadAllData();
      toast({
        title: 'تم حفظ الرابط بنجاح',
      });
    } catch (error) {
      console.error('Error saving social:', error);
      toast({
        title: 'خطأ في الحفظ',
        variant: 'destructive',
      });
    }
  };

  const deleteSocial = async (id: string) => {
    try {
      await supabase.from('social_links').delete().eq('id', id);
      loadAllData();
      toast({
        title: 'تم حذف الرابط بنجاح',
      });
    } catch (error) {
      console.error('Error deleting social:', error);
      toast({
        title: 'خطأ في الحذف',
        variant: 'destructive',
      });
    }
  };

  // Analytics functions
  const saveAnalytics = async () => {
    if (!editingAnalytics || !editingAnalytics.platform || !editingAnalytics.code) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (editingAnalytics.id) {
        await supabase
          .from('analytics_codes')
          .update(editingAnalytics)
          .eq('id', editingAnalytics.id);
      } else {
        await supabase
          .from('analytics_codes')
          .insert({
            platform: editingAnalytics.platform!,
            code: editingAnalytics.code!,
            active: editingAnalytics.active || false
          });
      }
      
      setAnalyticsDialogOpen(false);
      setEditingAnalytics(null);
      loadAllData();
      toast({
        title: 'تم حفظ كود التحليلات بنجاح',
      });
    } catch (error) {
      console.error('Error saving analytics:', error);
      toast({
        title: 'خطأ في الحفظ',
        variant: 'destructive',
      });
    }
  };

  const deleteAnalytics = async (id: string) => {
    try {
      await supabase.from('analytics_codes').delete().eq('id', id);
      loadAllData();
      toast({
        title: 'تم حذف كود التحليلات بنجاح',
      });
    } catch (error) {
      console.error('Error deleting analytics:', error);
      toast({
        title: 'خطأ في الحذف',
        variant: 'destructive',
      });
    }
  };

  // SEO functions
  const saveSEO = async () => {
    if (!editingSEO || !editingSEO.page_slug) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار الصفحة',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (editingSEO.id) {
        await supabase
          .from('page_seo')
          .update(editingSEO)
          .eq('id', editingSEO.id);
      } else {
        await supabase
          .from('page_seo')
          .insert({
            page_slug: editingSEO.page_slug!,
            title_ar: editingSEO.title_ar,
            title_en: editingSEO.title_en,
            description_ar: editingSEO.description_ar,
            description_en: editingSEO.description_en,
            keywords_ar: editingSEO.keywords_ar,
            keywords_en: editingSEO.keywords_en,
            og_image_url: editingSEO.og_image_url,
            canonical_url: editingSEO.canonical_url
          });
      }
      
      setSeoDialogOpen(false);
      setEditingSEO(null);
      loadAllData();
      toast({
        title: 'تم حفظ إعدادات SEO بنجاح',
      });
    } catch (error) {
      console.error('Error saving SEO:', error);
      toast({
        title: 'خطأ في الحفظ',
        variant: 'destructive',
      });
    }
  };

  // Site settings functions
  const saveSiteSettings = async () => {
    try {
      const settingsToSave = Object.entries(siteSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      // Update each setting
      for (const setting of settingsToSave) {
        await supabase
          .from('site_settings')
          .upsert(setting, { onConflict: 'setting_key' });
      }

      toast({
        title: 'تم حفظ إعدادات الموقع بنجاح',
      });
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast({
        title: 'خطأ في الحفظ',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              لوحة الإدارة
            </CardTitle>
            <CardDescription>تسجيل الدخول للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة إدارة الموقع</h1>
            <p className="text-muted-foreground">إدارة شاملة لجميع محتويات الموقع</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            تسجيل خروج
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 lg:grid-cols-14 lg:w-fit">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              أكواد التتبع
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              المدونات
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              المشاريع
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              الخدمات
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              السوشيال
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              الواتساب
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              منشئ المواقع
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              السيو
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الصيانة
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المدونات</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {blogs.filter(b => b.published).length} منشورة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{portfolio.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {portfolio.filter(p => p.published).length} منشورة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الخدمات</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {services.filter(s => s.active).length} نشطة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الزيارات اليوم</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dailyStats[0]?.total_views || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dailyStats[0]?.unique_visitors || 0} زائر فريد
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الزيارات (آخر 30 يوم)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyStats.slice(0, 10).map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{new Date(stat.date).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{stat.total_views} مشاهدة</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{stat.unique_visitors} زائر</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <SeoManager />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <ServicesManager />
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <SocialLinksManager />
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppButtonManager />
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المشاريع</h2>
              <Dialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingPortfolio({
                        title_ar: '',
                        title_en: '',
                        published: false
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مشروع جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPortfolio?.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {editingPortfolio && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="portfolio_title_ar">العنوان بالعربية</Label>
                          <Input
                            id="portfolio_title_ar"
                            value={editingPortfolio.title_ar || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title_ar: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio_title_en">العنوان بالإنجليزية</Label>
                          <Input
                            id="portfolio_title_en"
                            value={editingPortfolio.title_en || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title_en: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="portfolio_desc_ar">الوصف بالعربية</Label>
                          <Textarea
                            id="portfolio_desc_ar"
                            value={editingPortfolio.description_ar || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description_ar: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio_desc_en">الوصف بالإنجليزية</Label>
                          <Textarea
                            id="portfolio_desc_en"
                            value={editingPortfolio.description_en || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description_en: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="portfolio_image">رابط الصورة</Label>
                          <Input
                            id="portfolio_image"
                            value={editingPortfolio.image_url || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, image_url: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio_url">رابط المشروع</Label>
                          <Input
                            id="portfolio_url"
                            value={editingPortfolio.project_url || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, project_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="portfolio_category">الفئة</Label>
                          <Input
                            id="portfolio_category"
                            value={editingPortfolio.category || ''}
                            onChange={(e) => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio_technologies">التقنيات المستخدمة (مفصولة بفاصلة)</Label>
                          <Input
                            id="portfolio_technologies"
                            value={editingPortfolio.technologies?.join(', ') || ''}
                            onChange={(e) => setEditingPortfolio({ 
                              ...editingPortfolio, 
                              technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                            })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="portfolio_published"
                          checked={editingPortfolio.published || false}
                          onCheckedChange={(checked) => setEditingPortfolio({ ...editingPortfolio, published: checked })}
                        />
                        <Label htmlFor="portfolio_published">نشر المشروع</Label>
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPortfolioDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={savePortfolio}>
                      حفظ
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {portfolio.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {project.title_ar}
                          {project.published ? (
                            <Badge variant="default">منشور</Badge>
                          ) : (
                            <Badge variant="secondary">مسودة</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{project.title_en}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPortfolio(project);
                            setPortfolioDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePortfolio(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.description_ar || project.description_en}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.created_at).toLocaleDateString('ar-SA')}
                      </div>
                      {project.category && (
                        <Badge variant="outline">{project.category}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <BlogManager />
          </TabsContent>

          {/* Legacy Blogs Tab (keeping for compatibility) */}
          <TabsContent value="blogs-old" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المدونات</h2>
              <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingBlog({
                        title_ar: '',
                        title_en: '',
                        content_ar: '',
                        content_en: '',
                        published: false,
                        keywords_ar: [],
                        keywords_en: []
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مدونة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBlog?.id ? 'تعديل المدونة' : 'إضافة مدونة جديدة'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {editingBlog && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title_ar">العنوان بالعربية</Label>
                          <Input
                            id="title_ar"
                            value={editingBlog.title_ar || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, title_ar: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                          <Input
                            id="title_en"
                            value={editingBlog.title_en || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, title_en: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="excerpt_ar">المقدمة بالعربية</Label>
                          <Textarea
                            id="excerpt_ar"
                            value={editingBlog.excerpt_ar || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, excerpt_ar: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="excerpt_en">المقدمة بالإنجليزية</Label>
                          <Textarea
                            id="excerpt_en"
                            value={editingBlog.excerpt_en || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, excerpt_en: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="content_ar">المحتوى بالعربية</Label>
                          <Textarea
                            id="content_ar"
                            rows={6}
                            value={editingBlog.content_ar || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, content_ar: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content_en">المحتوى بالإنجليزية</Label>
                          <Textarea
                            id="content_en"
                            rows={6}
                            value={editingBlog.content_en || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, content_en: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="image_url">رابط الصورة</Label>
                        <Input
                          id="image_url"
                          value={editingBlog.image_url || ''}
                          onChange={(e) => setEditingBlog({ ...editingBlog, image_url: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="keywords_ar">الكلمات المفتاحية بالعربية (مفصولة بفاصلة)</Label>
                          <Input
                            id="keywords_ar"
                            value={editingBlog.keywords_ar?.join(', ') || ''}
                            onChange={(e) => setEditingBlog({ 
                              ...editingBlog, 
                              keywords_ar: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="keywords_en">الكلمات المفتاحية بالإنجليزية (مفصولة بفاصلة)</Label>
                          <Input
                            id="keywords_en"
                            value={editingBlog.keywords_en?.join(', ') || ''}
                            onChange={(e) => setEditingBlog({ 
                              ...editingBlog, 
                              keywords_en: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                            })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="meta_desc_ar">وصف الميتا بالعربية</Label>
                          <Textarea
                            id="meta_desc_ar"
                            value={editingBlog.meta_description_ar || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, meta_description_ar: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta_desc_en">وصف الميتا بالإنجليزية</Label>
                          <Textarea
                            id="meta_desc_en"
                            value={editingBlog.meta_description_en || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, meta_description_en: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="canonical_url">الرابط الأساسي</Label>
                        <Input
                          id="canonical_url"
                          value={editingBlog.canonical_url || ''}
                          onChange={(e) => setEditingBlog({ ...editingBlog, canonical_url: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="published"
                          checked={editingBlog.published || false}
                          onCheckedChange={(checked) => setEditingBlog({ ...editingBlog, published: checked })}
                        />
                        <Label htmlFor="published">نشر المدونة</Label>
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={saveBlog}>
                      حفظ
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {blogs.map((blog) => (
                <Card key={blog.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {blog.title_ar}
                          {blog.published ? (
                            <Badge variant="default">منشور</Badge>
                          ) : (
                            <Badge variant="secondary">مسودة</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{blog.title_en}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingBlog(blog);
                            setBlogDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBlog(blog.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {blog.excerpt_ar || blog.excerpt_en}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tracking Codes Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <AnalyticsCodesManager />
          </TabsContent>

          {/* Website Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <WebsiteBuilder />
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <UsersManager />
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <MaintenanceManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;