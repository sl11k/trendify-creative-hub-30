import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Edit, Trash2, Save, X, Search, Grid, List,
  // Portfolio Icons
  Briefcase, FolderOpen, Code, Palette, Database, Server,
  Globe, Smartphone, Monitor, Tablet, Laptop, Camera,
  Video, Music, Headphones, Mic, Speaker, Radio,
  GamepadIcon, Trophy, Target, Award, Star, Heart,
  ThumbsUp, Share, Link, Download, Upload, File,
  FileText, FileImage, FileVideo, Archive, Folder,
  // Business Icons
  Building, Store, ShoppingCart, CreditCard, DollarSign,
  TrendingUp, BarChart, PieChart, Activity, Calculator,
  Calendar, Clock, Timer, Bell, CheckCircle,
  // Design Icons
  Brush, Scissors, Crop, Move, RotateCcw, Maximize,
  Minimize, Zap, Sparkles, Wand, Layers, Eye,
  // Tech Icons
  Cpu, HardDrive, Wifi, Bluetooth, Battery, Power,
  Settings, Wrench, Bug, Shield,
  Lock, Key, UserCheck, Users, User, UserPlus,
  // Communication
  Mail, MessageCircle, Phone, Send, Inbox, AtSign,
  // Navigation
  Home, Menu, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  // Social
  Facebook, Twitter, Instagram, Youtube, Linkedin, Github
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Available icons with categories
const iconCategories = {
  portfolio: {
    name: 'محفظة الأعمال',
    icons: [
      { name: 'Briefcase', component: Briefcase },
      { name: 'FolderOpen', component: FolderOpen },
      { name: 'Code', component: Code },
      { name: 'Palette', component: Palette },
      { name: 'Database', component: Database },
      { name: 'Server', component: Server },
      { name: 'Globe', component: Globe },
      { name: 'Smartphone', component: Smartphone },
      { name: 'Monitor', component: Monitor },
      { name: 'Tablet', component: Tablet },
      { name: 'Laptop', component: Laptop },
      { name: 'Camera', component: Camera },
      { name: 'Video', component: Video },
      { name: 'Music', component: Music },
      { name: 'Headphones', component: Headphones },
      { name: 'Mic', component: Mic },
      { name: 'Speaker', component: Speaker },
      { name: 'Radio', component: Radio },
      { name: 'GamepadIcon', component: GamepadIcon },
      { name: 'Trophy', component: Trophy },
      { name: 'Target', component: Target },
      { name: 'Award', component: Award },
      { name: 'Star', component: Star },
      { name: 'Heart', component: Heart }
    ]
  },
  business: {
    name: 'الأعمال والتجارة',
    icons: [
      { name: 'Building', component: Building },
      { name: 'Store', component: Store },
      { name: 'ShoppingCart', component: ShoppingCart },
      { name: 'CreditCard', component: CreditCard },
      { name: 'DollarSign', component: DollarSign },
      { name: 'TrendingUp', component: TrendingUp },
      { name: 'BarChart', component: BarChart },
      { name: 'PieChart', component: PieChart },
      { name: 'Activity', component: Activity },
      { name: 'Calculator', component: Calculator }
    ]
  },
  design: {
    name: 'التصميم والإبداع',
    icons: [
      { name: 'Brush', component: Brush },
      { name: 'Scissors', component: Scissors },
      { name: 'Crop', component: Crop },
      { name: 'Move', component: Move },
      { name: 'RotateCcw', component: RotateCcw },
      { name: 'Maximize', component: Maximize },
      { name: 'Minimize', component: Minimize },
      { name: 'Zap', component: Zap },
      { name: 'Sparkles', component: Sparkles },
      { name: 'Wand', component: Wand },
      { name: 'Layers', component: Layers },
      { name: 'Eye', component: Eye }
    ]
  },
  files: {
    name: 'الملفات والمستندات',
    icons: [
      { name: 'File', component: File },
      { name: 'FileText', component: FileText },
      { name: 'FileImage', component: FileImage },
      { name: 'FileVideo', component: FileVideo },
      { name: 'Archive', component: Archive },
      { name: 'Folder', component: Folder },
      { name: 'Download', component: Download },
      { name: 'Upload', component: Upload },
      { name: 'Link', component: Link },
      { name: 'Share', component: Share }
    ]
  },
  time: {
    name: 'الوقت والتنظيم',
    icons: [
      { name: 'Calendar', component: Calendar },
      { name: 'Clock', component: Clock },
      { name: 'Timer', component: Timer },
      { name: 'Bell', component: Bell },
      { name: 'Bell', component: Bell },
      { name: 'CheckCircle', component: CheckCircle }
    ]
  },
  tech: {
    name: 'التكنولوجيا',
    icons: [
      { name: 'Cpu', component: Cpu },
      { name: 'HardDrive', component: HardDrive },
      { name: 'Wifi', component: Wifi },
      { name: 'Bluetooth', component: Bluetooth },
      { name: 'Battery', component: Battery },
      { name: 'Power', component: Power },
      { name: 'Settings', component: Settings },
      { name: 'Wrench', component: Wrench },
      { name: 'Wrench', component: Wrench },
      { name: 'Bug', component: Bug },
      { name: 'Shield', component: Shield }
    ]
  },
  users: {
    name: 'المستخدمون والأمان',
    icons: [
      { name: 'Users', component: Users },
      { name: 'User', component: User },
      { name: 'UserPlus', component: UserPlus },
      { name: 'UserCheck', component: UserCheck },
      { name: 'Lock', component: Lock },
      { name: 'Key', component: Key }
    ]
  },
  communication: {
    name: 'التواصل والرسائل',
    icons: [
      { name: 'Mail', component: Mail },
      { name: 'MessageCircle', component: MessageCircle },
      { name: 'Phone', component: Phone },
      { name: 'Send', component: Send },
      { name: 'Inbox', component: Inbox },
      { name: 'AtSign', component: AtSign }
    ]
  },
  navigation: {
    name: 'التنقل والتوجيه',
    icons: [
      { name: 'Home', component: Home },
      { name: 'Menu', component: Menu },
      { name: 'ChevronRight', component: ChevronRight },
      { name: 'ChevronLeft', component: ChevronLeft },
      { name: 'ChevronUp', component: ChevronUp },
      { name: 'ChevronDown', component: ChevronDown },
      { name: 'ArrowRight', component: ArrowRight },
      { name: 'ArrowLeft', component: ArrowLeft },
      { name: 'ArrowUp', component: ArrowUp },
      { name: 'ArrowDown', component: ArrowDown },
      { name: 'External', component: External }
    ]
  }
};

interface CustomIcon {
  id: string;
  name: string;
  icon_name: string;
  category: string;
  created_at: string;
}

export const IconManager = () => {
  const { toast } = useToast();
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customIconForm, setCustomIconForm] = useState({
    name: '',
    icon_name: '',
    category: 'portfolio'
  });

  useEffect(() => {
    loadCustomIcons();
  }, []);

  const loadCustomIcons = async () => {
    // For now, we'll use a simple state since we don't have a custom icons table
    // In a real implementation, you would fetch from a database
  };

  const handleSaveCustomIcon = async () => {
    if (!customIconForm.name.trim() || !customIconForm.icon_name.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم الأيقونة واسم الأيقونة التقني',
        variant: 'destructive'
      });
      return;
    }

    // Add to local state (in real app, save to database)
    const newIcon: CustomIcon = {
      id: Date.now().toString(),
      name: customIconForm.name,
      icon_name: customIconForm.icon_name,
      category: customIconForm.category,
      created_at: new Date().toISOString()
    };

    setCustomIcons(prev => [...prev, newIcon]);
    setCustomIconForm({ name: '', icon_name: '', category: 'portfolio' });
    setIsAddingCustom(false);

    toast({
      title: 'تم الحفظ',
      description: 'تم إضافة الأيقونة المخصصة بنجاح'
    });
  };

  const filteredIcons = selectedCategory ? 
    iconCategories[selectedCategory as keyof typeof iconCategories]?.icons.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">مدير الأيقونات</h2>
          <p className="text-muted-foreground">إدارة وتخصيص الأيقونات المتاحة في النظام</p>
        </div>
        <Button onClick={() => setIsAddingCustom(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          أيقونة مخصصة
        </Button>
      </div>

      {/* Custom Icon Form */}
      {isAddingCustom && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>إضافة أيقونة مخصصة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="iconName">اسم الأيقونة</Label>
                <Input
                  id="iconName"
                  value={customIconForm.name}
                  onChange={(e) => setCustomIconForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: تصميم جرافيك"
                />
              </div>
              <div>
                <Label htmlFor="iconTechName">الاسم التقني</Label>
                <Input
                  id="iconTechName"
                  value={customIconForm.icon_name}
                  onChange={(e) => setCustomIconForm(prev => ({ ...prev, icon_name: e.target.value }))}
                  placeholder="مثال: Palette"
                />
              </div>
              <div>
                <Label htmlFor="iconCategory">الفئة</Label>
                <select
                  id="iconCategory"
                  value={customIconForm.category}
                  onChange={(e) => setCustomIconForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {Object.entries(iconCategories).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveCustomIcon} className="gap-2">
                <Save className="h-4 w-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={() => setIsAddingCustom(false)} className="gap-2">
                <X className="h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الأيقونات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(iconCategories).map(([key, category]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(key)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Icons Grid/List */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8' 
          : 'grid-cols-1'
      }`}>
        {filteredIcons.map((icon) => {
          const IconComponent = icon.component;
          return (
            <Card 
              key={icon.name} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
            >
              <CardContent className={`${
                viewMode === 'grid' 
                  ? 'p-4 text-center' 
                  : 'p-4 flex items-center gap-4'
              }`}>
                <div className={`${
                  viewMode === 'grid' 
                    ? 'mb-2' 
                    : 'flex-shrink-0'
                }`}>
                  <IconComponent className="h-8 w-8 mx-auto text-primary" />
                </div>
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <p className="text-sm font-medium">{icon.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {iconCategories[selectedCategory as keyof typeof iconCategories]?.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Icons */}
      {customIcons.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">الأيقونات المخصصة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {customIcons.map((icon) => (
              <Card key={icon.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="mb-2">
                    <div className="h-8 w-8 mx-auto bg-muted rounded flex items-center justify-center">
                      <span className="text-xs">{icon.icon_name.slice(0, 2)}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{icon.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    مخصص
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredIcons.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground">
            لم يتم العثور على أيقونات تطابق البحث "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};