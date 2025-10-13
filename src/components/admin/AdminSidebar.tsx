import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Settings,
  FileText,
  Briefcase,
  Users,
  Globe,
  TrendingUp,
  MessageCircle,
  Share2,
  Search,
  Palette,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  Code,
  Sparkles
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "overview",
      title: "النظرة العامة",
      icon: BarChart,
      description: "إحصائيات عامة"
    },
    {
      id: "analytics",
      title: "التحليلات",
      icon: TrendingUp,
      description: "تحليلات مفصلة"
    },
    {
      id: "analytics-codes",
      title: "أكواد التتبع",
      icon: Code,
      description: "Google Analytics & Meta Pixel"
    },
    {
      id: "seo",
      title: "تحسين محركات البحث",
      icon: Search,
      description: "إدارة SEO"
    },
    {
      id: "ai-blog",
      title: "AI - مولد المقالات",
      icon: Sparkles,
      description: "إنشاء مقالات بالذكاء الاصطناعي"
    },
    {
      id: "ai-seo",
      title: "AI - محسن SEO",
      icon: Sparkles,
      description: "تحسين SEO تلقائياً"
    },
    {
      id: "blogs",
      title: "المدونة",
      icon: FileText,
      description: "إدارة المقالات"
    },
    {
      id: "portfolio",
      title: "الأعمال",
      icon: Briefcase,
      description: "إدارة المشاريع"
    },
    {
      id: "partners",
      title: "الشركاء",
      icon: Users,
      description: "شركاء النجاح"
    },
    {
      id: "tools",
      title: "الأدوات",
      icon: Settings,
      description: "الأدوات المجانية"
    },
    {
      id: "services",
      title: "الخدمات",
      icon: Settings,
      description: "إدارة الخدمات"
    },
    {
      id: "social-links",
      title: "الروابط الاجتماعية",
      icon: Share2,
      description: "إدارة وسائل التواصل"
    },
    {
      id: "whatsapp",
      title: "واتساب",
      icon: MessageCircle,
      description: "زر واتساب"
    },
    {
      id: "site-settings",
      title: "إعدادات الموقع",
      icon: Globe,
      description: "الإعدادات العامة"
    },
    {
      id: "users",
      title: "المستخدمين",
      icon: Users,
      description: "إدارة المستخدمين"
    },
    {
      id: "maintenance",
      title: "وضع الصيانة",
      icon: Eye,
      description: "تفعيل وضع الصيانة"
    }
  ];

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-gradient-primary">لوحة التحكم</h2>
              <p className="text-sm text-muted-foreground">إدارة الموقع</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-muted/50 hover:text-foreground",
                  isActive && "bg-primary text-primary-foreground shadow-md",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
                {!collapsed && (
                  <div className="flex-1 text-right">
                    <div className="font-medium">{item.title}</div>
                    <div className={cn(
                      "text-xs opacity-70",
                      isActive && "opacity-90"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          onClick={onLogout}
          className={cn(
            "w-full gap-2",
            collapsed && "h-10 w-10 p-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "تسجيل الخروج"}
        </Button>
      </div>
    </div>
  );
};