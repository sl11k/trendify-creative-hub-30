import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Partner {
  id: string;
  name_ar: string;
  name_en: string;
  logo_url: string;
  website_url?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const PartnersManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    logo_url: '',
    website_url: '',
    active: true,
    sort_order: 0
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true});

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error loading partners:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في تحميل الشركاء' : 'Error loading partners',
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
      logo_url: '',
      website_url: '',
      active: true,
      sort_order: 0
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.name_ar.trim() || !formData.name_en.trim() || !formData.logo_url.trim()) {
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
          .from('partners')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث' : 'Updated',
          description: isRTL ? 'تم تحديث الشريك بنجاح' : 'Partner updated successfully'
        });
      } else {
        const { error } = await (supabase as any)
          .from('partners')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الإنشاء' : 'Created',
          description: isRTL ? 'تم إنشاء الشريك بنجاح' : 'Partner created successfully'
        });
      }

      resetForm();
      loadPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في حفظ الشريك' : 'Error saving partner',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (item: Partner) => {
    setFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      logo_url: item.logo_url,
      website_url: item.website_url || '',
      active: item.active,
      sort_order: item.sort_order
    });
    setEditingId(item.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا الشريك؟' : 'Are you sure you want to delete this partner?')) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحذف' : 'Deleted',
        description: isRTL ? 'تم حذف الشريك بنجاح' : 'Partner deleted successfully'
      });
      
      loadPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في حذف الشريك' : 'Error deleting partner',
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
          <h2 className="text-2xl font-bold">{isRTL ? 'إدارة الشركاء' : 'Partners Management'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة شركاء النجاح' : 'Manage success partners'}
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isRTL ? 'شريك جديد' : 'New Partner'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? (isRTL ? 'تحرير الشريك' : 'Edit Partner') : (isRTL ? 'شريك جديد' : 'New Partner')}
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
                  placeholder={isRTL ? 'اسم الشريك بالعربية' : 'Partner name in Arabic'}
                />
              </div>
              <div>
                <Label htmlFor="name_en">{isRTL ? 'الاسم بالإنجليزية' : 'Name (English)'}</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                  placeholder={isRTL ? 'اسم الشريك بالإنجليزية' : 'Partner name in English'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo_url">{isRTL ? 'رابط الشعار' : 'Logo URL'}</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط شعار الشريك' : 'Partner logo URL'}
                />
              </div>
              <div>
                <Label htmlFor="website_url">{isRTL ? 'رابط الموقع' : 'Website URL'}</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder={isRTL ? 'رابط موقع الشريك' : 'Partner website URL'}
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
        {partners.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden p-4">
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={isRTL ? item.name_ar : item.name_en}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Image className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {isRTL ? item.name_ar : item.name_en}
                  </h3>
                  {item.website_url && (
                    <a 
                      href={item.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {isRTL ? 'زيارة الموقع' : 'Visit Website'}
                    </a>
                  )}
                </div>
                <Badge variant={item.active ? "default" : "secondary"} className="ml-2">
                  {item.active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                </Badge>
              </div>
              
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

      {partners.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isRTL ? 'لا يوجد شركاء' : 'No Partners'}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? 'ابدأ بإضافة أول شريك' : 'Start by adding your first partner'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PartnersManager;
