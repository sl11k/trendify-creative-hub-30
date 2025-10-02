import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tool {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  url: string;
  icon_name?: string;
  category_ar?: string;
  category_en?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const ToolsManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    url: '',
    icon_name: '',
    category_ar: '',
    category_en: '',
    active: true,
    sort_order: 0
  });

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('tools')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error loading tools:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في تحميل الأدوات' : 'Error loading tools',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      url: '',
      icon_name: '',
      category_ar: '',
      category_en: '',
      active: true,
      sort_order: 0
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.name_ar.trim() || !formData.name_en.trim() || !formData.url.trim()) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        const { error } = await (supabase as any)
          .from('tools')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث' : 'Updated',
          description: isRTL ? 'تم تحديث الأداة بنجاح' : 'Tool updated successfully'
        });
      } else {
        const { error } = await (supabase as any)
          .from('tools')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الإنشاء' : 'Created',
          description: isRTL ? 'تم إنشاء الأداة بنجاح' : 'Tool created successfully'
        });
      }

      resetForm();
      loadTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في حفظ الأداة' : 'Error saving tool',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (item: Tool) => {
    setFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      description_ar: item.description_ar,
      description_en: item.description_en,
      url: item.url,
      icon_name: item.icon_name || '',
      category_ar: item.category_ar || '',
      category_en: item.category_en || '',
      active: item.active,
      sort_order: item.sort_order
    });
    setEditingId(item.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الأداة؟' : 'Are you sure you want to delete this tool?')) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحذف' : 'Deleted',
        description: isRTL ? 'تم حذف الأداة بنجاح' : 'Tool deleted successfully'
      });
      
      loadTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في حذف الأداة' : 'Error deleting tool',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="p-6">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'إدارة الأدوات' : 'Tools Management'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة الأدوات المساعدة للمتاجر والتجار' : 'Manage helpful tools for stores and merchants'}
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isRTL ? 'أداة جديدة' : 'New Tool'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? (isRTL ? 'تحرير الأداة' : 'Edit Tool') : (isRTL ? 'أداة جديدة' : 'New Tool')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name_ar">{isRTL ? 'الاسم بالعربية' : 'Name (Arabic)'}</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder={isRTL ? 'اسم الأداة بالعربية' : 'Tool name in Arabic'}
                />
              </div>
              <div>
                <Label htmlFor="name_en">{isRTL ? 'الاسم بالإنجليزية' : 'Name (English)'}</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder={isRTL ? 'اسم الأداة بالإنجليزية' : 'Tool name in English'}
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
                  placeholder={isRTL ? 'وصف الأداة بالعربية' : 'Tool description in Arabic'}
                />
              </div>
              <div>
                <Label htmlFor="description_en">{isRTL ? 'الوصف بالإنجليزية' : 'Description (English)'}</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  placeholder={isRTL ? 'وصف الأداة بالإنجليزية' : 'Tool description in English'}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="url">{isRTL ? 'رابط الأداة' : 'Tool URL'}</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_ar">{isRTL ? 'الفئة بالعربية' : 'Category (Arabic)'}</Label>
                <Input
                  id="category_ar"
                  value={formData.category_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_ar: e.target.value }))}
                  placeholder={isRTL ? 'فئة الأداة بالعربية' : 'Tool category in Arabic'}
                />
              </div>
              <div>
                <Label htmlFor="category_en">{isRTL ? 'الفئة بالإنجليزية' : 'Category (English)'}</Label>
                <Input
                  id="category_en"
                  value={formData.category_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_en: e.target.value }))}
                  placeholder={isRTL ? 'فئة الأداة بالإنجليزية' : 'Tool category in English'}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sort_order">{isRTL ? 'ترتيب العرض' : 'Sort Order'}</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">{isRTL ? 'نشط' : 'Active'}</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {isRTL ? item.name_ar : item.name_en}
                  </h3>
                  {(item.category_ar || item.category_en) && (
                    <Badge variant="outline" className="mb-2">
                      {isRTL ? item.category_ar : item.category_en}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {isRTL ? item.description_ar : item.description_en}
                  </p>
                </div>
                <Badge variant={item.active ? "default" : "secondary"} className="ml-2">
                  {item.active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                </Badge>
              </div>
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline mb-3"
              >
                <ExternalLink className="h-4 w-4" />
                {isRTL ? 'زيارة الأداة' : 'Visit Tool'}
              </a>
              
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

      {tools.length === 0 && (
        <div className="text-center py-12">
          <ExternalLink className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isRTL ? 'لا توجد أدوات' : 'No Tools'}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? 'ابدأ بإضافة أول أداة' : 'Start by adding your first tool'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsManager;
