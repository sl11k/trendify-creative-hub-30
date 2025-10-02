import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, Sidebar, PanelTop, PanelBottom, PanelLeft, PanelRight,
  Grid, Columns, Rows, Save, RotateCcw, Eye, Settings,
  Monitor, Tablet, Smartphone, Palette, Move, ArrowUp, ArrowDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LayoutSettings {
  id: string;
  sidebar_position: 'left' | 'right' | 'top' | 'bottom' | 'hidden';
  sidebar_collapsed: boolean;
  header_position: 'top' | 'bottom' | 'hidden';
  footer_position: 'bottom' | 'top' | 'hidden';
  layout_type: 'sidebar' | 'topbar' | 'minimal' | 'dashboard';
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  sidebar_width: number;
  header_height: number;
  content_max_width: number;
  grid_columns: number;
  responsive_breakpoints: Record<string, any>;
  custom_css: string;
  created_at: string;
  updated_at: string;
}

const layoutPresets = [
  {
    id: 'modern-sidebar',
    name: 'شريط جانبي حديث',
    description: 'تخطيط احترافي مع شريط جانبي يسار',
    layout_type: 'sidebar' as const,
    sidebar_position: 'left' as const,
    header_position: 'top' as const,
    footer_position: 'bottom' as const,
    sidebar_width: 280,
    preview: '/images/layouts/modern-sidebar.jpg'
  },
  {
    id: 'top-navigation',
    name: 'تنقل علوي',
    description: 'تخطيط نظيف مع شريط تنقل علوي',
    layout_type: 'topbar' as const,
    sidebar_position: 'hidden' as const,
    header_position: 'top' as const,
    footer_position: 'bottom' as const,
    sidebar_width: 0,
    preview: '/images/layouts/top-navigation.jpg'
  },
  {
    id: 'minimal-design',
    name: 'تصميم بسيط',
    description: 'تخطيط بسيط ونظيف',
    layout_type: 'minimal' as const,
    sidebar_position: 'hidden' as const,
    header_position: 'top' as const,
    footer_position: 'bottom' as const,
    sidebar_width: 0,
    preview: '/images/layouts/minimal.jpg'
  },
  {
    id: 'dashboard-pro',
    name: 'لوحة تحكم احترافية',
    description: 'تخطيط متقدم للوحات التحكم',
    layout_type: 'dashboard' as const,
    sidebar_position: 'left' as const,
    header_position: 'top' as const,
    footer_position: 'bottom' as const,
    sidebar_width: 320,
    preview: '/images/layouts/dashboard.jpg'
  }
];

export const LayoutCustomizer = () => {
  const { toast } = useToast();
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    id: '',
    sidebar_position: 'left',
    sidebar_collapsed: false,
    header_position: 'top',
    footer_position: 'bottom',
    layout_type: 'sidebar',
    theme: 'light',
    primary_color: '#3b82f6',
    sidebar_width: 280,
    header_height: 64,
    content_max_width: 1200,
    grid_columns: 12,
    responsive_breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    custom_css: '',
    created_at: '',
    updated_at: ''
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    loadLayoutSettings();
  }, []);

  const loadLayoutSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'layout_settings')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const settings = JSON.parse(data.setting_value);
        setLayoutSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error loading layout settings:', error);
    }
  };

  const saveLayoutSettings = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'layout_settings',
          setting_value: JSON.stringify(layoutSettings)
        });

      if (error) throw error;

      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ إعدادات التخطيط بنجاح'
      });
    } catch (error) {
      console.error('Error saving layout settings:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الإعدادات',
        variant: 'destructive'
      });
    }
  };

  const applyPreset = (preset: typeof layoutPresets[0]) => {
    setLayoutSettings(prev => ({
      ...prev,
      layout_type: preset.layout_type,
      sidebar_position: preset.sidebar_position,
      header_position: preset.header_position,
      footer_position: preset.footer_position,
      sidebar_width: preset.sidebar_width
    }));
    setSelectedPreset(preset.id);
  };

  const resetToDefault = () => {
    setLayoutSettings({
      id: '',
      sidebar_position: 'left',
      sidebar_collapsed: false,
      header_position: 'top',
      footer_position: 'bottom',
      layout_type: 'sidebar',
      theme: 'light',
      primary_color: '#3b82f6',
      sidebar_width: 280,
      header_height: 64,
      content_max_width: 1200,
      grid_columns: 12,
      responsive_breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      },
      custom_css: '',
      created_at: '',
      updated_at: ''
    });
    setSelectedPreset('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">مخصص التخطيط</h2>
          <p className="text-muted-foreground">تخصيص شكل وتصميم واجهة الإدارة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button onClick={saveLayoutSettings} className="gap-2">
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="layout" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="layout">التخطيط</TabsTrigger>
              <TabsTrigger value="presets">القوالب</TabsTrigger>
              <TabsTrigger value="styling">التصميم</TabsTrigger>
              <TabsTrigger value="responsive">الاستجابة</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    إعدادات التخطيط الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نوع التخطيط</Label>
                      <Select 
                        value={layoutSettings.layout_type} 
                        onValueChange={(value: any) => setLayoutSettings(prev => ({ ...prev, layout_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sidebar">شريط جانبي</SelectItem>
                          <SelectItem value="topbar">شريط علوي</SelectItem>
                          <SelectItem value="minimal">بسيط</SelectItem>
                          <SelectItem value="dashboard">لوحة تحكم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>موقع الشريط الجانبي</Label>
                      <Select 
                        value={layoutSettings.sidebar_position} 
                        onValueChange={(value: any) => setLayoutSettings(prev => ({ ...prev, sidebar_position: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">يسار</SelectItem>
                          <SelectItem value="right">يمين</SelectItem>
                          <SelectItem value="top">أعلى</SelectItem>
                          <SelectItem value="bottom">أسفل</SelectItem>
                          <SelectItem value="hidden">مخفي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>موقع الهيدر</Label>
                      <Select 
                        value={layoutSettings.header_position} 
                        onValueChange={(value: any) => setLayoutSettings(prev => ({ ...prev, header_position: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">أعلى</SelectItem>
                          <SelectItem value="bottom">أسفل</SelectItem>
                          <SelectItem value="hidden">مخفي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>موقع الفوتر</Label>
                      <Select 
                        value={layoutSettings.footer_position} 
                        onValueChange={(value: any) => setLayoutSettings(prev => ({ ...prev, footer_position: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom">أسفل</SelectItem>
                          <SelectItem value="top">أعلى</SelectItem>
                          <SelectItem value="hidden">مخفي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collapsed"
                      checked={layoutSettings.sidebar_collapsed}
                      onCheckedChange={(checked) => setLayoutSettings(prev => ({ ...prev, sidebar_collapsed: checked }))}
                    />
                    <Label htmlFor="collapsed">الشريط الجانبي مطوي افتراضياً</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>قوالب التخطيط الجاهزة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {layoutPresets.map((preset) => (
                      <Card 
                        key={preset.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPreset === preset.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => applyPreset(preset)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                            <Layout className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold mb-1">{preset.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{preset.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {preset.layout_type === 'sidebar' ? 'شريط جانبي' :
                             preset.layout_type === 'topbar' ? 'شريط علوي' :
                             preset.layout_type === 'minimal' ? 'بسيط' : 'لوحة تحكم'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="styling" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    إعدادات التصميم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>اللون الأساسي</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={layoutSettings.primary_color}
                          onChange={(e) => setLayoutSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="w-12 h-10 rounded border"
                        />
                        <input
                          type="text"
                          value={layoutSettings.primary_color}
                          onChange={(e) => setLayoutSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="flex-1 p-2 border rounded"
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>المظهر</Label>
                      <Select 
                        value={layoutSettings.theme} 
                        onValueChange={(value: any) => setLayoutSettings(prev => ({ ...prev, theme: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">فاتح</SelectItem>
                          <SelectItem value="dark">داكن</SelectItem>
                          <SelectItem value="auto">تلقائي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>عرض الشريط الجانبي (px)</Label>
                      <input
                        type="number"
                        value={layoutSettings.sidebar_width}
                        onChange={(e) => setLayoutSettings(prev => ({ ...prev, sidebar_width: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded"
                        min="200"
                        max="400"
                      />
                    </div>

                    <div>
                      <Label>ارتفاع الهيدر (px)</Label>
                      <input
                        type="number"
                        value={layoutSettings.header_height}
                        onChange={(e) => setLayoutSettings(prev => ({ ...prev, header_height: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded"
                        min="48"
                        max="120"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsive" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الاستجابة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>الحد الأقصى لعرض المحتوى (px)</Label>
                    <input
                      type="number"
                      value={layoutSettings.content_max_width}
                      onChange={(e) => setLayoutSettings(prev => ({ ...prev, content_max_width: parseInt(e.target.value) }))}
                      className="w-full p-2 border rounded"
                      min="800"
                      max="1600"
                    />
                  </div>

                  <div>
                    <Label>عدد أعمدة الشبكة</Label>
                    <Select 
                      value={layoutSettings.grid_columns.toString()} 
                      onValueChange={(value) => setLayoutSettings(prev => ({ ...prev, grid_columns: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 عمود</SelectItem>
                        <SelectItem value="16">16 عمود</SelectItem>
                        <SelectItem value="24">24 عمود</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  معاينة
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`bg-muted rounded-lg p-2 ${
                previewDevice === 'desktop' ? 'aspect-video' :
                previewDevice === 'tablet' ? 'aspect-[4/5]' : 'aspect-[9/16]'
              }`}>
                <div className="w-full h-full bg-background rounded border relative overflow-hidden">
                  {/* Header Preview */}
                  {layoutSettings.header_position === 'top' && (
                    <div 
                      className="bg-primary/10 border-b"
                      style={{ height: `${(layoutSettings.header_height / 600) * 100}%` }}
                    >
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        Header
                      </div>
                    </div>
                  )}

                  {/* Main Content Area */}
                  <div className="flex flex-1 h-full">
                    {/* Sidebar Preview */}
                    {layoutSettings.sidebar_position === 'left' && (
                      <div 
                        className="bg-accent/50 border-r"
                        style={{ 
                          width: `${(layoutSettings.sidebar_width / 800) * 100}%`,
                          minWidth: previewDevice === 'mobile' ? '60px' : '80px'
                        }}
                      >
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                          Sidebar
                        </div>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="flex-1 bg-background flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center">
                        <div>المحتوى الرئيسي</div>
                        <div className="mt-1 text-xs opacity-70">
                          {previewDevice === 'desktop' ? 'سطح المكتب' :
                           previewDevice === 'tablet' ? 'تابلت' : 'موبايل'}
                        </div>
                      </div>
                    </div>

                    {/* Right Sidebar */}
                    {layoutSettings.sidebar_position === 'right' && (
                      <div 
                        className="bg-accent/50 border-l"
                        style={{ width: `${(layoutSettings.sidebar_width / 800) * 100}%` }}
                      >
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                          Sidebar
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Preview */}
                  {layoutSettings.footer_position === 'bottom' && (
                    <div className="bg-muted/50 border-t h-8">
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        Footer
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Settings Summary */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">التخطيط:</span>
                  <Badge variant="outline">
                    {layoutSettings.layout_type === 'sidebar' ? 'شريط جانبي' :
                     layoutSettings.layout_type === 'topbar' ? 'شريط علوي' :
                     layoutSettings.layout_type === 'minimal' ? 'بسيط' : 'لوحة تحكم'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الشريط الجانبي:</span>
                  <Badge variant="outline">
                    {layoutSettings.sidebar_position === 'hidden' ? 'مخفي' : layoutSettings.sidebar_position}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المظهر:</span>
                  <Badge variant="outline">
                    {layoutSettings.theme === 'light' ? 'فاتح' :
                     layoutSettings.theme === 'dark' ? 'داكن' : 'تلقائي'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};