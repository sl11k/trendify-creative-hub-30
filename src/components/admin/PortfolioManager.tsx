import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Edit, Trash2, Save, X, Image, Upload, FileText, Film, Github,
  // Portfolio Icons - Extended Collection
  Briefcase, FolderOpen, Code, Palette, Database, Server,
  Globe, Smartphone, Monitor, Tablet, Laptop, Camera,
  Video, Music, Headphones, Mic, Speaker, Radio,
  GamepadIcon, Trophy, Target, Award, Star, Heart,
  // Business Icons
  Building, Store, ShoppingCart, CreditCard, DollarSign,
  TrendingUp, BarChart, PieChart, Activity, Calculator,
  // Design Icons
  Brush, Scissors, Crop, Move, RotateCcw, Maximize,
  Minimize, Zap, Sparkles, Wand, Layers, Eye,
  // Tech Icons
  Cpu, HardDrive, Wifi, Bluetooth, Battery, Power,
  Settings, Wrench, Bug, Shield,
  // More icons for variety
  CloudIcon, Download, Share, Link,
  Calendar, Clock, Timer, Bell, CheckCircle,
  Mail, MessageCircle, Phone, Send, Inbox, AtSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface PortfolioFile {
  type: 'image' | 'video' | 'pdf' | 'link';
  url: string;
  name: string;
}

interface PortfolioItem {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  logo_url?: string;
  project_url?: string;
  github_url?: string;
  category?: string;
  technologies?: string[];
  project_type?: string;
  files?: PortfolioFile[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

const PortfolioManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    image_url: '',
    logo_url: '',
    project_url: '',
    github_url: '',
    category: '',
    project_type: 'website',
    technologies: [] as string[],
    files: [] as PortfolioFile[],
    published: false
  });

  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const portfolioData = (data || []).map(item => ({
        ...item,
        files: (item.files as any) ? JSON.parse(JSON.stringify(item.files)) : []
      })) as PortfolioItem[];
      
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في تحميل المشاريع' : 'Error loading projects',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      image_url: '',
      logo_url: '',
      project_url: '',
      github_url: '',
      category: '',
      project_type: 'website',
      technologies: [],
      files: [],
      published: false
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedFiles: PortfolioFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `files/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        let fileType: 'image' | 'video' | 'pdf' | 'link' = 'image';
        if (file.type.startsWith('video/')) fileType = 'video';
        else if (file.type === 'application/pdf') fileType = 'pdf';

        uploadedFiles.push({
          type: fileType,
          url: publicUrl,
          name: file.name
        });
      }

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles]
      }));

      toast({
        title: isRTL ? 'تم الرفع' : 'Uploaded',
        description: isRTL ? `تم رفع ${uploadedFiles.length} ملف بنجاح` : `${uploadedFiles.length} file(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في رفع الملفات' : 'Error uploading files',
        variant: 'destructive'
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    const url = prompt(isRTL ? 'أدخل رابط الملف أو المنشور' : 'Enter file or post URL');
    const name = prompt(isRTL ? 'أدخل اسم الرابط' : 'Enter link name');
    
    if (url && name) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, { type: 'link', url, name }]
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.title_ar.trim() || !formData.title_en.trim()) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال العنوان بالعربية والإنجليزية' : 'Please enter title in both Arabic and English',
        variant: 'destructive'
      });
      return;
    }

    try {
      const portfolioData = {
        ...formData,
        technologies: formData.technologies.length > 0 ? formData.technologies : null,
        files: JSON.parse(JSON.stringify(formData.files.length > 0 ? formData.files : []))
      };

      if (editingId) {
        const { error } = await supabase
          .from('portfolio')
          .update(portfolioData as any)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث' : 'Updated',
          description: isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('portfolio')
          .insert([portfolioData as any]);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الإنشاء' : 'Created',
          description: isRTL ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully'
        });
      }

      resetForm();
      loadPortfolio();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في حفظ المشروع' : 'Error saving project',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title_ar: item.title_ar,
      title_en: item.title_en,
      description_ar: item.description_ar || '',
      description_en: item.description_en || '',
      image_url: item.image_url || '',
      logo_url: item.logo_url || '',
      project_url: item.project_url || '',
      github_url: item.github_url || '',
      category: item.category || '',
      project_type: item.project_type || 'website',
      technologies: item.technologies || [],
      files: item.files || [],
      published: item.published
    });
    setEditingId(item.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحذف' : 'Deleted',
        description: isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully'
      });
      
      loadPortfolio();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في حذف المشروع' : 'Error deleting project',
        variant: 'destructive'
      });
    }
  };

  const handleTechnologiesChange = (value: string) => {
    const techs = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setFormData(prev => ({ ...prev, technologies: techs }));
  };

  // Extended icon options for portfolio items
  const portfolioIcons = [
    { name: 'Briefcase', icon: Briefcase, category: 'business' },
    { name: 'Code', icon: Code, category: 'development' },
    { name: 'Palette', icon: Palette, category: 'design' },
    { name: 'Database', icon: Database, category: 'development' },
    { name: 'Server', icon: Server, category: 'development' },
    { name: 'Globe', icon: Globe, category: 'web' },
    { name: 'Smartphone', icon: Smartphone, category: 'mobile' },
    { name: 'Monitor', icon: Monitor, category: 'web' },
    { name: 'Tablet', icon: Tablet, category: 'mobile' },
    { name: 'Laptop', icon: Laptop, category: 'web' },
    { name: 'Camera', icon: Camera, category: 'media' },
    { name: 'Video', icon: Video, category: 'media' },
    { name: 'Music', icon: Music, category: 'media' },
    { name: 'Headphones', icon: Headphones, category: 'media' },
    { name: 'Mic', icon: Mic, category: 'media' },
    { name: 'Speaker', icon: Speaker, category: 'media' },
    { name: 'Radio', icon: Radio, category: 'media' },
    { name: 'GamepadIcon', icon: GamepadIcon, category: 'gaming' },
    { name: 'Trophy', icon: Trophy, category: 'achievement' },
    { name: 'Target', icon: Target, category: 'business' },
    { name: 'Award', icon: Award, category: 'achievement' },
    { name: 'Star', icon: Star, category: 'rating' },
    { name: 'Heart', icon: Heart, category: 'social' },
    { name: 'Building', icon: Building, category: 'business' },
    { name: 'Store', icon: Store, category: 'business' },
    { name: 'ShoppingCart', icon: ShoppingCart, category: 'ecommerce' },
    { name: 'CreditCard', icon: CreditCard, category: 'finance' },
    { name: 'DollarSign', icon: DollarSign, category: 'finance' },
    { name: 'TrendingUp', icon: TrendingUp, category: 'analytics' },
    { name: 'BarChart', icon: BarChart, category: 'analytics' },
    { name: 'PieChart', icon: PieChart, category: 'analytics' },
    { name: 'Activity', icon: Activity, category: 'analytics' },
    { name: 'Calculator', icon: Calculator, category: 'tools' },
    { name: 'Brush', icon: Brush, category: 'design' },
    { name: 'Scissors', icon: Scissors, category: 'design' },
    { name: 'Crop', icon: Crop, category: 'design' },
    { name: 'Move', icon: Move, category: 'design' },
    { name: 'RotateCcw', icon: RotateCcw, category: 'design' },
    { name: 'Maximize', icon: Maximize, category: 'interface' },
    { name: 'Minimize', icon: Minimize, category: 'interface' },
    { name: 'Zap', icon: Zap, category: 'performance' },
    { name: 'Sparkles', icon: Sparkles, category: 'magic' },
    { name: 'Wand', icon: Wand, category: 'magic' },
    { name: 'Layers', icon: Layers, category: 'design' },
    { name: 'Eye', icon: Eye, category: 'interface' },
    { name: 'Cpu', icon: Cpu, category: 'tech' },
    { name: 'HardDrive', icon: HardDrive, category: 'tech' },
    { name: 'Wifi', icon: Wifi, category: 'connectivity' },
    { name: 'Bluetooth', icon: Bluetooth, category: 'connectivity' },
    { name: 'Battery', icon: Battery, category: 'power' },
    { name: 'Power', icon: Power, category: 'power' },
    { name: 'Settings', icon: Settings, category: 'configuration' },
    { name: 'Wrench', icon: Wrench, category: 'tools' },
    { name: 'Wrench', icon: Wrench, category: 'tools' },
    { name: 'Bug', icon: Bug, category: 'development' },
    { name: 'Shield', icon: Shield, category: 'security' },
    { name: 'CloudIcon', icon: CloudIcon, category: 'cloud' },
    { name: 'Download', icon: Download, category: 'transfer' },
    { name: 'Upload', icon: Upload, category: 'transfer' },
    { name: 'Share', icon: Share, category: 'social' },
    { name: 'Link', icon: Link, category: 'web' },
    { name: 'External', icon: External, category: 'web' },
    { name: 'Calendar', icon: Calendar, category: 'time' },
    { name: 'Clock', icon: Clock, category: 'time' },
    { name: 'Timer', icon: Timer, category: 'time' },
    { name: 'Bell', icon: Bell, category: 'notification' },
    { name: 'Bell', icon: Bell, category: 'notification' },
    { name: 'CheckCircle', icon: CheckCircle, category: 'status' },
    { name: 'Mail', icon: Mail, category: 'communication' },
    { name: 'MessageCircle', icon: MessageCircle, category: 'communication' },
    { name: 'Phone', icon: Phone, category: 'communication' },
    { name: 'Send', icon: Send, category: 'communication' },
    { name: 'Inbox', icon: Inbox, category: 'communication' },
    { name: 'AtSign', icon: AtSign, category: 'communication' }
  ];

  const [selectedIconCategory, setSelectedIconCategory] = useState('all');
  const [showIconSelector, setShowIconSelector] = useState(false);

  const iconCategories = [
    { id: 'all', name: 'الكل' },
    { id: 'business', name: 'أعمال' },
    { id: 'development', name: 'تطوير' },
    { id: 'design', name: 'تصميم' },
    { id: 'web', name: 'ويب' },
    { id: 'mobile', name: 'موبايل' },
    { id: 'media', name: 'وسائط' },
    { id: 'gaming', name: 'ألعاب' },
    { id: 'analytics', name: 'تحليلات' },
    { id: 'tech', name: 'تقنية' },
    { id: 'communication', name: 'تواصل' }
  ];

  const filteredIcons = selectedIconCategory === 'all' 
    ? portfolioIcons 
    : portfolioIcons.filter(icon => icon.category === selectedIconCategory);

  if (loading) {
    return <div className="p-6">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'إدارة المشاريع' : 'Portfolio Management'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة مشاريع معرض الأعمال' : 'Manage portfolio projects'}
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isRTL ? 'مشروع جديد' : 'New Project'}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? (isRTL ? 'تحرير المشروع' : 'Edit Project') : (isRTL ? 'مشروع جديد' : 'New Project')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_ar">{isRTL ? 'العنوان بالعربية' : 'Title (Arabic)'}</Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  placeholder={isRTL ? 'عنوان المشروع بالعربية' : 'Project title in Arabic'}
                />
              </div>
              <div>
                <Label htmlFor="title_en">{isRTL ? 'العنوان بالإنجليزية' : 'Title (English)'}</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder={isRTL ? 'عنوان المشروع بالإنجليزية' : 'Project title in English'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_ar">{isRTL ? 'الوصف بالعربية' : 'Description (Arabic)'}</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                  placeholder={isRTL ? 'وصف المشروع بالعربية' : 'Project description in Arabic'}
                />
              </div>
              <div>
                <Label htmlFor="description_en">{isRTL ? 'الوصف بالإنجليزية' : 'Description (English)'}</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  placeholder={isRTL ? 'وصف المشروع بالإنجليزية' : 'Project description in English'}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="project_type">{isRTL ? 'نوع المشروع' : 'Project Type'}</Label>
              <Select value={formData.project_type} onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">{isRTL ? 'موقع إلكتروني' : 'Website'}</SelectItem>
                  <SelectItem value="branding">{isRTL ? 'هوية بصرية' : 'Branding'}</SelectItem>
                  <SelectItem value="photography">{isRTL ? 'تصوير' : 'Photography'}</SelectItem>
                  <SelectItem value="content">{isRTL ? 'كتابة محتوى' : 'Content Writing'}</SelectItem>
                  <SelectItem value="graphic_design">{isRTL ? 'تصميم جرافيك' : 'Graphic Design'}</SelectItem>
                  <SelectItem value="mobile_app">{isRTL ? 'تطبيق موبايل' : 'Mobile App'}</SelectItem>
                  <SelectItem value="video">{isRTL ? 'فيديو' : 'Video'}</SelectItem>
                  <SelectItem value="other">{isRTL ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">{isRTL ? 'الفئة' : 'Category'}</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder={isRTL ? 'فئة المشروع' : 'Project category'}
                />
              </div>
              <div>
                <Label htmlFor="technologies">{isRTL ? 'التقنيات المستخدمة' : 'Technologies'}</Label>
                <Input
                  id="technologies"
                  value={formData.technologies.join(', ')}
                  onChange={(e) => handleTechnologiesChange(e.target.value)}
                  placeholder={isRTL ? 'فصل بالفواصل: React, Node.js, MongoDB' : 'Comma separated: React, Node.js, MongoDB'}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="logo_url">{isRTL ? 'لوغو المشروع (رابط أو صورة)' : 'Project Logo (URL or Image)'}</Label>
              <div className="space-y-2">
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط اللوغو' : 'Logo URL'}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{isRTL ? 'أو' : 'or'}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isRTL ? 'رفع لوغو' : 'Upload Logo'}
                  </Button>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    try {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `logo-${Math.random().toString(36).substring(2)}.${fileExt}`;
                      
                      const { error: uploadError } = await supabase.storage
                        .from('portfolio')
                        .upload(fileName, file);
                      
                      if (uploadError) throw uploadError;
                      
                      const { data: { publicUrl } } = supabase.storage
                        .from('portfolio')
                        .getPublicUrl(fileName);
                      
                      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
                      
                      toast({
                        title: isRTL ? 'تم الرفع' : 'Uploaded',
                        description: isRTL ? 'تم رفع اللوغو بنجاح' : 'Logo uploaded successfully'
                      });
                    } catch (error) {
                      console.error('Error uploading logo:', error);
                      toast({
                        title: isRTL ? 'خطأ' : 'Error',
                        description: isRTL ? 'حدث خطأ في رفع اللوغو' : 'Error uploading logo',
                        variant: 'destructive'
                      });
                    }
                  }}
                  className="hidden"
                />
                {formData.logo_url && (
                  <div className="mt-2">
                    <img src={formData.logo_url} alt="Logo preview" className="h-16 w-16 object-contain border rounded" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_url">{isRTL ? 'رابط المشروع (اختياري)' : 'Project URL (Optional)'}</Label>
                <Input
                  id="project_url"
                  value={formData.project_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط المشروع المباشر' : 'Direct project URL'}
                />
              </div>
              <div>
                <Label htmlFor="github_url">{isRTL ? 'رابط GitHub (اختياري)' : 'GitHub URL (Optional)'}</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div>
              <Label>{isRTL ? 'الملفات والصور' : 'Files and Images'}</Label>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploadingFiles}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingFiles ? (isRTL ? 'جاري الرفع...' : 'Uploading...') : (isRTL ? 'رفع ملفات' : 'Upload Files')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLink}
                    className="gap-2"
                  >
                    <Link className="h-4 w-4" />
                    {isRTL ? 'إضافة رابط' : 'Add Link'}
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {formData.files.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.files.map((file, index) => (
                      <Card key={index} className="p-2">
                        <div className="flex items-center gap-2">
                          {file.type === 'image' && <Image className="h-4 w-4 text-muted-foreground" />}
                          {file.type === 'video' && <Film className="h-4 w-4 text-muted-foreground" />}
                          {file.type === 'pdf' && <FileText className="h-4 w-4 text-muted-foreground" />}
                          {file.type === 'link' && <Link className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-xs flex-1 truncate">{file.name}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {isRTL 
                    ? 'يمكنك رفع صور، فيديوهات، ملفات PDF، أو إضافة روابط خارجية' 
                    : 'You can upload images, videos, PDFs, or add external links'}
                </p>
              </div>
            </div>

            {/* Icon Selector */}
            <div>
              <Label>{isRTL ? 'أيقونة المشروع' : 'Project Icon'}</Label>
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="w-full justify-start gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  {isRTL ? 'اختر أيقونة للمشروع' : 'Choose Project Icon'}
                </Button>
                
                {showIconSelector && (
                  <Card className="mt-2 p-4">
                    <div className="space-y-3">
                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-1">
                        {iconCategories.map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={selectedIconCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedIconCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Icon Grid */}
                      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                        {filteredIcons.map((iconOption) => {
                          const IconComponent = iconOption.icon;
                          return (
                            <Button
                              key={iconOption.name}
                              type="button"
                              variant="ghost"
                              className="h-12 w-12 p-2"
                              onClick={() => {
                                // Here you would save the icon selection
                                // For now, we'll just close the selector
                                setShowIconSelector(false);
                                toast({
                                  title: isRTL ? 'تم اختيار الأيقونة' : 'Icon Selected',
                                  description: `${iconOption.name} icon selected`
                                });
                              }}
                            >
                              {React.createElement(IconComponent as any, { className: "h-6 w-6" })}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published">{isRTL ? 'نشر المشروع' : 'Publish Project'}</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {isRTL ? 'حفظ' : 'Save'}
              </Button>
              <Button variant="outline" onClick={resetForm} className="gap-2">
                <X className="h-4 w-4" />
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={isRTL ? item.title_ar : item.title_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {isRTL ? item.title_ar : item.title_en}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isRTL ? item.description_ar : item.description_en}
                  </p>
                </div>
                <Badge variant={item.published ? "default" : "secondary"} className="ml-2">
                  {item.published ? (isRTL ? 'منشور' : 'Published') : (isRTL ? 'مسودة' : 'Draft')}
                </Badge>
              </div>
              
              {item.category && (
                <Badge variant="outline" className="mb-2">
                  {item.category}
                </Badge>
              )}
              
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{item.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1 gap-1"
                >
                  <Edit className="h-3 w-3" />
                  {isRTL ? 'تحرير' : 'Edit'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  {isRTL ? 'حذف' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isRTL ? 'لا توجد مشاريع' : 'No Projects'}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? 'ابدأ بإضافة مشروعك الأول' : 'Start by adding your first project'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;