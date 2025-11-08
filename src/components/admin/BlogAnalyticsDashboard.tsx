import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Eye, Users, Clock, TrendingUp, Link2, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogStats {
  totalViews: number;
  totalUniqueVisitors: number;
  avgTimeOnPage: number;
  totalBacklinks: number;
  totalShares: number;
  avgBounceRate: number;
}

interface TopBlog {
  id: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  backlinksCount: number;
}

interface Backlink {
  id: string;
  blogTitle: string;
  sourceUrl: string;
  sourceDomain: string;
  anchorText: string;
  domainAuthority: number;
  linkType: string;
  discoveredAt: string;
}

export const BlogAnalyticsDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [topBlogs, setTopBlogs] = useState<TopBlog[]>([]);
  const [recentBacklinks, setRecentBacklinks] = useState<Backlink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch overall stats
      const { data: analytics } = await supabase
        .from("blog_analytics")
        .select("*");

      const totalViews = analytics?.reduce((sum, a) => sum + a.views, 0) || 0;
      const totalUniqueVisitors = analytics?.reduce((sum, a) => sum + a.unique_visitors, 0) || 0;
      const avgTimeOnPage = analytics?.length 
        ? Math.round(analytics.reduce((sum, a) => sum + a.avg_time_on_page, 0) / analytics.length)
        : 0;
      const avgBounceRate = analytics?.length
        ? analytics.reduce((sum, a) => sum + Number(a.bounce_rate), 0) / analytics.length
        : 0;

      const { data: backlinks } = await supabase
        .from("blog_backlinks")
        .select("*")
        .eq("is_active", true);

      const { data: analyticsData } = await supabase
        .from("blog_analytics")
        .select("social_shares");

      const totalShares = analyticsData?.reduce((sum, a) => sum + a.social_shares, 0) || 0;

      setStats({
        totalViews,
        totalUniqueVisitors,
        avgTimeOnPage,
        totalBacklinks: backlinks?.length || 0,
        totalShares,
        avgBounceRate
      });

      // Fetch top performing blogs
      const { data: topBlogsData } = await supabase
        .from("blog_analytics")
        .select(`
          blog_id,
          views,
          unique_visitors,
          blogs!inner(title_${language})
        `)
        .order("views", { ascending: false })
        .limit(5);

      if (topBlogsData) {
        const blogsWithBacklinks = await Promise.all(
          topBlogsData.map(async (blog) => {
            const { count } = await supabase
              .from("blog_backlinks")
              .select("*", { count: "exact", head: true })
              .eq("blog_id", blog.blog_id)
              .eq("is_active", true);

            return {
              id: blog.blog_id,
              title: blog.blogs[`title_${language}`],
              views: blog.views,
              uniqueVisitors: blog.unique_visitors,
              backlinksCount: count || 0
            };
          })
        );

        setTopBlogs(blogsWithBacklinks);
      }

      // Fetch recent backlinks
      const { data: backlinksData } = await supabase
        .from("blog_backlinks")
        .select(`
          *,
          blogs!inner(title_${language})
        `)
        .eq("is_active", true)
        .order("discovered_at", { ascending: false })
        .limit(10);

      if (backlinksData) {
        setRecentBacklinks(
          backlinksData.map((b) => ({
            id: b.id,
            blogTitle: b.blogs[`title_${language}`],
            sourceUrl: b.source_url,
            sourceDomain: b.source_domain,
            anchorText: b.anchor_text || "",
            domainAuthority: b.domain_authority || 0,
            linkType: b.link_type,
            discoveredAt: new Date(b.discovered_at).toLocaleDateString("ar-SA")
          }))
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const isRTL = language === "ar";

  const StatCard = ({ title, value, icon: Icon, suffix = "" }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString()}
          {suffix}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isRTL ? "تحليلات المقالات" : "Blog Analytics"}
        </h2>
        <p className="text-muted-foreground">
          {isRTL ? "مراقبة أداء المقالات والتفاعل" : "Monitor blog performance and engagement"}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={isRTL ? "إجمالي المشاهدات" : "Total Views"}
          value={stats?.totalViews || 0}
          icon={Eye}
        />
        <StatCard
          title={isRTL ? "الزوار الفريدون" : "Unique Visitors"}
          value={stats?.totalUniqueVisitors || 0}
          icon={Users}
        />
        <StatCard
          title={isRTL ? "متوسط الوقت (ثانية)" : "Avg Time (sec)"}
          value={stats?.avgTimeOnPage || 0}
          icon={Clock}
          suffix="s"
        />
        <StatCard
          title={isRTL ? "إجمالي الروابط الخلفية" : "Total Backlinks"}
          value={stats?.totalBacklinks || 0}
          icon={Link2}
        />
        <StatCard
          title={isRTL ? "المشاركات الاجتماعية" : "Social Shares"}
          value={stats?.totalShares || 0}
          icon={Share2}
        />
        <StatCard
          title={isRTL ? "معدل الارتداد" : "Bounce Rate"}
          value={Math.round(stats?.avgBounceRate || 0)}
          icon={TrendingUp}
          suffix="%"
        />
      </div>

      <Tabs defaultValue="top-blogs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top-blogs">
            {isRTL ? "أفضل المقالات" : "Top Blogs"}
          </TabsTrigger>
          <TabsTrigger value="backlinks">
            {isRTL ? "الروابط الخلفية" : "Backlinks"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "أفضل 5 مقالات أداءً" : "Top 5 Performing Blogs"}</CardTitle>
              <CardDescription>
                {isRTL ? "المقالات الأكثر مشاهدة وتفاعلاً" : "Most viewed and engaged blogs"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBlogs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name={isRTL ? "المشاهدات" : "Views"} />
                  <Bar dataKey="uniqueVisitors" fill="hsl(var(--secondary))" name={isRTL ? "زوار فريدون" : "Unique Visitors"} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                {topBlogs.map((blog, index) => (
                  <div key={blog.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{blog.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {blog.views.toLocaleString()} {isRTL ? "مشاهدة" : "views"} • {blog.backlinksCount} {isRTL ? "رابط خلفي" : "backlinks"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "الروابط الخلفية الحديثة" : "Recent Backlinks"}</CardTitle>
              <CardDescription>
                {isRTL ? "آخر الروابط الخلفية المكتشفة" : "Latest discovered backlinks"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBacklinks.map((backlink) => (
                  <div key={backlink.id} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{backlink.blogTitle}</p>
                        <a 
                          href={backlink.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {backlink.sourceDomain}
                        </a>
                        {backlink.anchorText && (
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? "نص الرابط:" : "Anchor:"} "{backlink.anchorText}"
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          backlink.linkType === 'dofollow' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {backlink.linkType}
                        </span>
                        {backlink.domainAuthority > 0 && (
                          <p className="text-sm font-medium">DA: {backlink.domainAuthority}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{backlink.discoveredAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};