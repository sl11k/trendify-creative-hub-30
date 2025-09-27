import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, Plus, Edit, Trash2, Save, X, Zap, Megaphone, Code, Palette, 
  Smartphone, BarChart, ShoppingCart, Target, TrendingUp, UserCheck,
  Shield, Lightbulb, Settings, Globe, Camera, MessageSquare, Heart,
  Star, Award, Trophy, Crown, Diamond, Gem, Sparkles, Rocket,
  Home, Building, Store, Coffee, Car, Plane, Ship, Train,
  Users, User, UserPlus, UserMinus, UserX, Eye, EyeOff,
  Mail, Phone, MapPin, Clock, Calendar, Bell, AlertCircle,
  CheckCircle, XCircle, Info, HelpCircle, Search, Filter,
  Download, Upload, Share, Link, Copy, Clipboard, File,
  Image, Video, Music, Headphones, Monitor, Laptop, Tablet,
  Wifi, Battery, Power, Cpu, HardDrive, Database, Server,
  Lock, Unlock, Key, Shield as ShieldIcon, Eye as EyeIcon,
  Sun, Moon, Cloud, CloudRain, Snowflake, Wind, Thermometer,
  Activity, BarChart3, PieChart, LineChart, TrendingDown,
  DollarSign, CreditCard, Wallet, Banknote, Calculator,
  Wrench, Hammer, Scissors, Paintbrush, Brush, Pen, Pencil
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceFormData {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon_name: string;
  gradient_from: string;
  gradient_to: string;
  active: boolean;
  sort_order: number;
}

const ServicesManager = () => {
  const { isRTL } = useLanguage();
  const { services, loading, refetch } = useServices();
  const { toast } = useToast();
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    icon_name: 'zap',
    gradient_from: '#3b82f6',
    gradient_to: '#8b5cf6',
    active: true,
    sort_order: 0
  });

  // Icon mapping for proper ES module imports
  const iconMap = {
    // Business & Marketing
    'megaphone': Megaphone,
    'target': Target,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'bar-chart': BarChart,
    'bar-chart-3': BarChart3,
    'pie-chart': PieChart,
    'line-chart': LineChart,
    'activity': Activity,
    'award': Award,
    'trophy': Trophy,
    'crown': Crown,
    'star': Star,
    'heart': Heart,
    
    // Technology & Development
    'code': Code,
    'smartphone': Smartphone,
    'monitor': Monitor,
    'laptop': Laptop,
    'tablet': Tablet,
    'server': Server,
    'database': Database,
    'cpu': Cpu,
    'hard-drive': HardDrive,
    'wifi': Wifi,
    'battery': Battery,
    'power': Power,
    'globe': Globe,
    
    // Design & Creative
    'palette': Palette,
    'camera': Camera,
    'image': Image,
    'video': Video,
    'music': Music,
    'headphones': Headphones,
    'paintbrush': Paintbrush,
    'brush': Brush,
    'pen': Pen,
    'pencil': Pencil,
    'sparkles': Sparkles,
    'diamond': Diamond,
    'gem': Gem,
    
    // Business & Finance
    'shopping-cart': ShoppingCart,
    'store': Store,
    'building': Building,
    'dollar-sign': DollarSign,
    'credit-card': CreditCard,
    'wallet': Wallet,
    'banknote': Banknote,
    'calculator': Calculator,
    
    // Communication & Contact
    'message-square': MessageSquare,
    'mail': Mail,
    'phone': Phone,
    'users': Users,
    'user': User,
    'user-plus': UserPlus,
    'user-check': UserCheck,
    
    // Tools & Utilities
    'settings': Settings,
    'wrench': Wrench,
    'hammer': Hammer,
    'scissors': Scissors,
    'search': Search,
    'filter': Filter,
    'download': Download,
    'upload': Upload,
    'share': Share,
    'link': Link,
    'copy': Copy,
    'clipboard': Clipboard,
    
    // Security & Protection
    'shield': Shield,
    'lock': Lock,
    'unlock': Unlock,
    'key': Key,
    'eye': Eye,
    'eye-off': EyeOff,
    
    // Energy & Innovation
    'zap': Zap,
    'lightbulb': Lightbulb,
    'rocket': Rocket,
    
    // Location & Travel
    'map-pin': MapPin,
    'home': Home,
    'car': Car,
    'plane': Plane,
    'ship': Ship,
    'train': Train,
    
    // Time & Scheduling
    'clock': Clock,
    'calendar': Calendar,
    'bell': Bell,
    
    // Status & Alerts
    'check-circle': CheckCircle,
    'x-circle': XCircle,
    'alert-circle': AlertCircle,
    'info': Info,
    'help-circle': HelpCircle,
    
    // Weather & Environment
    'sun': Sun,
    'moon': Moon,
    'cloud': Cloud,
    'cloud-rain': CloudRain,
    'snowflake': Snowflake,
    'wind': Wind,
    'thermometer': Thermometer,
    
    // Files & Documents
    'file': File,
    'coffee': Coffee
  };

  const iconCategories = [
    {
      name: 'الأعمال والتسويق',
      icons: [
        { value: 'megaphone', label: 'مكبر الصوت' },
        { value: 'target', label: 'هدف' },
        { value: 'trending-up', label: 'ارتفاع' },
        { value: 'trending-down', label: 'انخفاض' },
        { value: 'bar-chart', label: 'رسم بياني' },
        { value: 'bar-chart-3', label: 'رسم بياني 3' },
        { value: 'pie-chart', label: 'مخطط دائري' },
        { value: 'line-chart', label: 'مخطط خطي' },
        { value: 'activity', label: 'نشاط' },
        { value: 'award', label: 'جائزة' },
        { value: 'trophy', label: 'كأس' },
        { value: 'crown', label: 'تاج' },
        { value: 'star', label: 'نجمة' },
        { value: 'heart', label: 'قلب' }
      ]
    },
    {
      name: 'التكنولوجيا والتطوير',
      icons: [
        { value: 'code', label: 'كود' },
        { value: 'smartphone', label: 'هاتف ذكي' },
        { value: 'monitor', label: 'شاشة' },
        { value: 'laptop', label: 'حاسوب محمول' },
        { value: 'tablet', label: 'جهاز لوحي' },
        { value: 'server', label: 'خادم' },
        { value: 'database', label: 'قاعدة بيانات' },
        { value: 'cpu', label: 'معالج' },
        { value: 'hard-drive', label: 'قرص صلب' },
        { value: 'wifi', label: 'واي فاي' },
        { value: 'battery', label: 'بطارية' },
        { value: 'power', label: 'طاقة' },
        { value: 'globe', label: 'كرة أرضية' }
      ]
    },
    {
      name: 'التصميم والإبداع',
      icons: [
        { value: 'palette', label: 'لوحة ألوان' },
        { value: 'camera', label: 'كاميرا' },
        { value: 'image', label: 'صورة' },
        { value: 'video', label: 'فيديو' },
        { value: 'music', label: 'موسيقى' },
        { value: 'headphones', label: 'سماعات' },
        { value: 'paintbrush', label: 'فرشاة رسم' },
        { value: 'brush', label: 'فرشاة' },
        { value: 'pen', label: 'قلم' },
        { value: 'pencil', label: 'قلم رصاص' },
        { value: 'sparkles', label: 'بريق' },
        { value: 'diamond', label: 'ماس' },
        { value: 'gem', label: 'جوهرة' }
      ]
    },
    {
      name: 'الأعمال والمالية',
      icons: [
        { value: 'shopping-cart', label: 'عربة التسوق' },
        { value: 'store', label: 'متجر' },
        { value: 'building', label: 'مبنى' },
        { value: 'dollar-sign', label: 'دولار' },
        { value: 'credit-card', label: 'بطاقة ائتمان' },
        { value: 'wallet', label: 'محفظة' },
        { value: 'banknote', label: 'ورقة نقدية' },
        { value: 'calculator', label: 'آلة حاسبة' }
      ]
    },
    {
      name: 'التواصل والاتصال',
      icons: [
        { value: 'message-square', label: 'رسالة' },
        { value: 'mail', label: 'بريد إلكتروني' },
        { value: 'phone', label: 'هاتف' },
        { value: 'users', label: 'مستخدمون' },
        { value: 'user', label: 'مستخدم' },
        { value: 'user-plus', label: 'إضافة مستخدم' },
        { value: 'user-check', label: 'مستخدم مؤكد' }
      ]
    },
    {
      name: 'الأدوات والمرافق',
      icons: [
        { value: 'settings', label: 'إعدادات' },
        { value: 'wrench', label: 'مفتاح ربط' },
        { value: 'hammer', label: 'مطرقة' },
        { value: 'scissors', label: 'مقص' },
        { value: 'search', label: 'بحث' },
        { value: 'filter', label: 'مرشح' },
        { value: 'download', label: 'تنزيل' },
        { value: 'upload', label: 'رفع' },
        { value: 'share', label: 'مشاركة' },
        { value: 'link', label: 'رابط' },
        { value: 'copy', label: 'نسخ' },
        { value: 'clipboard', label: 'حافظة' }
      ]
    },
    {
      name: 'الأمان والحماية',
      icons: [
        { value: 'shield', label: 'درع' },
        { value: 'lock', label: 'قفل' },
        { value: 'unlock', label: 'فتح القفل' },
        { value: 'key', label: 'مفتاح' },
        { value: 'eye', label: 'عين' },
        { value: 'eye-off', label: 'عين مغلقة' }
      ]
    },
    {
      name: 'الطاقة والابتكار',
      icons: [
        { value: 'zap', label: 'صاعقة' },
        { value: 'lightbulb', label: 'لمبة' },
        { value: 'rocket', label: 'صاروخ' }
      ]
    },
    {
      name: 'الموقع والسفر',
      icons: [
        { value: 'map-pin', label: 'دبوس خريطة' },
        { value: 'home', label: 'منزل' },
        { value: 'car', label: 'سيارة' },
        { value: 'plane', label: 'طائرة' },
        { value: 'ship', label: 'سفينة' },
        { value: 'train', label: 'قطار' }
      ]
    },
    {
      name: 'الوقت والجدولة',
      icons: [
        { value: 'clock', label: 'ساعة' },
        { value: 'calendar', label: 'تقويم' },
        { value: 'bell', label: 'جرس' }
      ]
    },
    {
      name: 'الحالة والتنبيهات',
      icons: [
        { value: 'check-circle', label: 'دائرة صح' },
        { value: 'x-circle', label: 'دائرة خطأ' },
        { value: 'alert-circle', label: 'دائرة تنبيه' },
        { value: 'info', label: 'معلومات' },
        { value: 'help-circle', label: 'دائرة مساعدة' }
      ]
    },
    {
      name: 'الطقس والبيئة',
      icons: [
        { value: 'sun', label: 'شمس' },
        { value: 'moon', label: 'قمر' },
        { value: 'cloud', label: 'غيمة' },
        { value: 'cloud-rain', label: 'مطر' },
        { value: 'snowflake', label: 'ثلج' },
        { value: 'wind', label: 'رياح' },
        { value: 'thermometer', label: 'ترمومتر' }
      ]
    },
    {
      name: 'الملفات والمستندات',
      icons: [
        { value: 'file', label: 'ملف' },
        { value: 'coffee', label: 'قهوة' }
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث بنجاح' : 'Updated Successfully',
          description: isRTL ? 'تم تحديث الخدمة بنجاح' : 'Service updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الإضافة بنجاح' : 'Added Successfully',
          description: isRTL ? 'تم إضافة الخدمة بنجاح' : 'Service added successfully'
        });
      }
      
      resetForm();
      refetch();
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'An error occurred while saving',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      title_ar: service.title_ar,
      title_en: service.title_en,
      description_ar: service.description_ar || '',
      description_en: service.description_en || '',
      icon_name: service.icon_name || 'zap',
      gradient_from: service.gradient_from || '#3b82f6',
      gradient_to: service.gradient_to || '#8b5cf6',
      active: service.active,
      sort_order: service.sort_order || 0
    });
    setEditingService(service.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(isRTL ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الحذف بنجاح' : 'Deleted Successfully',
          description: isRTL ? 'تم حذف الخدمة بنجاح' : 'Service deleted successfully'
        });
        
        refetch();
      } catch (error) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting',
          variant: 'destructive'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      icon_name: 'zap',
      gradient_from: '#3b82f6',
      gradient_to: '#8b5cf6',
      active: true,
      sort_order: 0
    });
    setEditingService(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{isRTL ? 'إدارة الخدمات' : 'Services Management'}</h2>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {isRTL ? 'إضافة خدمة' : 'Add Service'}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService 
                ? (isRTL ? 'تعديل الخدمة' : 'Edit Service')
                : (isRTL ? 'إضافة خدمة جديدة' : 'Add New Service')
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ar">{isRTL ? 'العنوان بالعربية' : 'Arabic Title'}</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">{isRTL ? 'العنوان بالإنجليزية' : 'English Title'}</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_ar">{isRTL ? 'الوصف بالعربية' : 'Arabic Description'}</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">{isRTL ? 'الوصف بالإنجليزية' : 'English Description'}</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="icon_name">{isRTL ? 'الأيقونة' : 'Icon'}</Label>
                  <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = iconMap[formData.icon_name as keyof typeof iconMap] || Zap;
                            return <IconComponent className="h-4 w-4" />;
                          })()}
                          {iconCategories.flatMap(cat => cat.icons).find(icon => icon.value === formData.icon_name)?.label || formData.icon_name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50 max-h-80 overflow-y-auto">
                      {iconCategories.map(category => (
                        <div key={category.name}>
                          <div className="px-2 py-1 text-sm font-medium text-muted-foreground bg-muted/50">
                            {category.name}
                          </div>
                          {category.icons.map(option => {
                            const IconComponent = iconMap[option.value as keyof typeof iconMap] || Zap;
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gradient_from">{isRTL ? 'لون البداية' : 'Start Color'}</Label>
                  <Input
                    id="gradient_from"
                    type="color"
                    value={formData.gradient_from}
                    onChange={(e) => setFormData({ ...formData, gradient_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gradient_to">{isRTL ? 'لون النهاية' : 'End Color'}</Label>
                  <Input
                    id="gradient_to"
                    type="color"
                    value={formData.gradient_to}
                    onChange={(e) => setFormData({ ...formData, gradient_to: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">{isRTL ? 'نشطة' : 'Active'}</Label>
                </div>
                <div>
                  <Label htmlFor="sort_order">{isRTL ? 'ترتيب العرض' : 'Sort Order'}</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
                  <X className="h-4 w-4" />
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {isRTL ? service.title_ar : service.title_en}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {isRTL ? service.description_ar : service.description_en}
              </CardDescription>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{service.active ? (isRTL ? 'نشطة' : 'Active') : (isRTL ? 'غير نشطة' : 'Inactive')}</span>
                <span>{isRTL ? 'الترتيب:' : 'Order:'} {service.sort_order}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;