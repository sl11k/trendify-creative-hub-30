import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Edit, Trash2, Save, X } from 'lucide-react';
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

  const iconOptions = [
    { value: 'megaphone', label: 'Megaphone' },
    { value: 'code', label: 'Code' },
    { value: 'palette', label: 'Palette' },
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'bar-chart', label: 'Bar Chart' },
    { value: 'globe', label: 'Globe' },
    { value: 'zap', label: 'Zap' },
    { value: 'target', label: 'Target' }
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
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