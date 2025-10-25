import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface PortfolioItem {
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
  project_type?: string;
  github_url?: string;
  logo_url?: string;
  files?: any[];
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
    project_url: '',
    github_url: '',
    logo_url: '',
    category: '',
    technologies: [] as string[],
    project_type: 'website',
    files: [] as any[],
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
      setPortfolio((data as any) || []);
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
      project_url: '',
      github_url: '',
      logo_url: '',
      category: '',
      technologies: [],
      project_type: 'website',
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
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedUrls.map(url => ({ url, type: 'image' }))]
      }));

      toast({
        title: isRTL ? 'تم الرفع' : 'Uploaded',
        description: isRTL ? 'تم رفع الملفات بنجاح' : 'Files uploaded successfully'
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
        technologies: formData.technologies.length > 0 ? formData.technologies : null
      };

      if (editingId) {
        const { error } = await supabase
          .from('portfolio')
          .update(portfolioData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث' : 'Updated',
          description: isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('portfolio')
          .insert([portfolioData]);

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
      project_url: item.project_url || '',
      github_url: item.github_url || '',
      logo_url: item.logo_url || '',
      category: item.category || '',
      technologies: item.technologies || [],
      project_type: item.project_type || 'website',
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
              <select
                id="project_type"
                value={formData.project_type}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="website">{isRTL ? 'موقع إلكتروني' : 'Website'}</option>
                <option value="branding">{isRTL ? 'هوية بصرية' : 'Branding'}</option>
                <option value="content">{isRTL ? 'كتابة محتوى' : 'Content Writing'}</option>
                <option value="photography">{isRTL ? 'تصوير منتجات' : 'Product Photography'}</option>
                <option value="design">{isRTL ? 'تصميم جرافيك' : 'Graphic Design'}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image_url">{isRTL ? 'رابط الصورة الرئيسية' : 'Main Image URL'}</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط صورة المشروع' : 'Project image URL'}
                />
              </div>
              <div>
                <Label htmlFor="logo_url">{isRTL ? 'رابط الشعار' : 'Logo URL'}</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط شعار المشروع' : 'Project logo URL'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_url">{isRTL ? 'رابط المشروع' : 'Project URL'}</Label>
                <Input
                  id="project_url"
                  value={formData.project_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط المشروع المباشر' : 'Direct project URL'}
                />
              </div>
              <div>
                <Label htmlFor="github_url">{isRTL ? 'رابط GitHub' : 'GitHub URL'}</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط GitHub (اختياري)' : 'GitHub URL (optional)'}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="files">{isRTL ? 'رفع ملفات إضافية' : 'Upload Additional Files'}</Label>
              <Input
                id="files"
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileUpload}
                disabled={uploadingFiles}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? 'يمكنك رفع صور، فيديوهات، أو ملفات PDF' : 'You can upload images, videos, or PDF files'}
              </p>
            </div>

            {formData.files.length > 0 && (
              <div>
                <Label>{isRTL ? 'الملفات المرفوعة' : 'Uploaded Files'}</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={file.url || file} 
                        alt={`File ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">{isRTL ? 'القسم' : 'Category'}</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">{isRTL ? 'اختر القسم' : 'Select Category'}</option>
                  <option value="المواقع الإلكترونية">{isRTL ? 'المواقع الإلكترونية' : 'Websites'}</option>
                  <option value="الحلول التقنية">{isRTL ? 'الحلول التقنية' : 'Tech Solutions'}</option>
                  <option value="التصميم">{isRTL ? 'التصميم' : 'Design'}</option>
                  <option value="التصوير">{isRTL ? 'التصوير' : 'Photography'}</option>
                  <option value="الهوية البصرية">{isRTL ? 'الهوية البصرية' : 'Branding'}</option>
                  <option value="المحتوى">{isRTL ? 'المحتوى' : 'Content'}</option>
                </select>
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