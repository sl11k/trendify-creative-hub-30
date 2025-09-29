import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Partner = Tables<'partners'>;

interface PartnersManagerProps {
  partners: Partner[];
  onRefresh: () => void;
}

const PartnersManager = ({ partners, onRefresh }: PartnersManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    logo_url: '',
    website_url: '',
    active: true,
    sort_order: 0
  });

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      logo_url: '',
      website_url: '',
      active: true,
      sort_order: 0
    });
    setEditingPartner(null);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name_ar: partner.name_ar,
      name_en: partner.name_en,
      logo_url: partner.logo_url,
      website_url: partner.website_url || '',
      active: partner.active,
      sort_order: partner.sort_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(formData)
          .eq('id', editingPartner.id);
        
        if (error) throw error;
        toast({ title: 'تم تحديث الشريك بنجاح' });
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: 'تم إضافة الشريك بنجاح' });
      }
      
      setIsDialogOpen(false);
      resetForm();
      onRefresh();
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الشريك؟')) return;
    
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'تم حذف الشريك بنجاح' });
      onRefresh();
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: error instanceof Error ? error.message : 'حدث خطأ في حذف الشريك',
        variant: 'destructive'
      });
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ active: !partner.active })
        .eq('id', partner.id);
      
      if (error) throw error;
      toast({ title: `تم ${!partner.active ? 'تفعيل' : 'إلغاء تفعيل'} الشريك بنجاح` });
      onRefresh();
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: error instanceof Error ? error.message : 'حدث خطأ في تحديث حالة الشريك',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">إدارة الشركاء</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة شريك جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'تعديل الشريك' : 'إضافة شريك جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ar">الاسم بالعربية</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo_url">رابط الشعار</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="website_url">رابط الموقع (اختياري)</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort_order">ترتيب العرض</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">نشط</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingPartner ? 'تحديث' : 'إضافة'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className={`${!partner.active ? 'opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{partner.name_ar}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(partner)}
                  >
                    {partner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(partner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(partner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-center">
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name_ar}
                    className="h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{partner.name_en}</p>
                {partner.website_url && (
                  <a 
                    href={partner.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    زيارة الموقع
                  </a>
                )}
                <p className="text-sm">ترتيب العرض: {partner.sort_order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">لم يتم إضافة أي شركاء بعد</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartnersManager;