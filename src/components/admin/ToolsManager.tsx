import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import * as Icons from 'lucide-react';

type Tool = Tables<'tools'>;

interface ToolsManagerProps {
  tools: Tool[];
  onRefresh: () => void;
}

const ToolsManager = ({ tools, onRefresh }: ToolsManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
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

  const iconOptions = [
    'Globe', 'Calculator', 'BarChart', 'PieChart', 'TrendingUp', 'DollarSign',
    'ShoppingCart', 'Package', 'Truck', 'CreditCard', 'FileText', 'Search',
    'Mail', 'Phone', 'Camera', 'Image', 'Video', 'Music', 'Headphones',
    'Calendar', 'Clock', 'MapPin', 'Compass', 'Target', 'Zap', 'Settings',
    'Tool', 'Wrench', 'Hammer', 'Scissors', 'Paintbrush', 'Palette'
  ];

  const categoryOptions = {
    ar: ['أدوات التسويق', 'أدوات التحليل', 'أدوات التصميم', 'أدوات الإنتاجية', 'أدوات التجارة الإلكترونية', 'أدوات عامة'],
    en: ['Marketing Tools', 'Analytics Tools', 'Design Tools', 'Productivity Tools', 'E-commerce Tools', 'General Tools']
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
    setEditingTool(null);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name_ar: tool.name_ar,
      name_en: tool.name_en,
      description_ar: tool.description_ar,
      description_en: tool.description_en,
      url: tool.url,
      icon_name: tool.icon_name || '',
      category_ar: tool.category_ar || '',
      category_en: tool.category_en || '',
      active: tool.active,
      sort_order: tool.sort_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(formData)
          .eq('id', editingTool.id);
        
        if (error) throw error;
        toast({ title: 'تم تحديث الأداة بنجاح' });
      } else {
        const { error } = await supabase
          .from('tools')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: 'تم إضافة الأداة بنجاح' });
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
    if (!confirm('هل أنت متأكد من حذف هذه الأداة؟')) return;
    
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'تم حذف الأداة بنجاح' });
      onRefresh();
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: error instanceof Error ? error.message : 'حدث خطأ في حذف الأداة',
        variant: 'destructive'
      });
    }
  };

  const toggleActive = async (tool: Tool) => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ active: !tool.active })
        .eq('id', tool.id);
      
      if (error) throw error;
      toast({ title: `تم ${!tool.active ? 'تفعيل' : 'إلغاء تفعيل'} الأداة بنجاح` });
      onRefresh();
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: error instanceof Error ? error.message : 'حدث خطأ في تحديث حالة الأداة',
        variant: 'destructive'
      });
    }
  };

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <ExternalLink className="w-5 h-5" />;
    
    try {
      const IconComponent = (Icons as any)[iconName];
      if (IconComponent && typeof IconComponent === 'function') {
        return React.createElement(IconComponent, { className: "w-5 h-5" });
      }
      return <ExternalLink className="w-5 h-5" />;
    } catch {
      return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">إدارة الأدوات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة أداة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTool ? 'تعديل الأداة' : 'إضافة أداة جديدة'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ar">اسم الأداة بالعربية</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">اسم الأداة بالإنجليزية</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_ar">الوصف بالعربية</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="url">رابط الأداة</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_ar">التصنيف بالعربية</Label>
                  <Select 
                    value={formData.category_ar} 
                    onValueChange={(value) => setFormData({ ...formData, category_ar: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.ar.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category_en">التصنيف بالإنجليزية</Label>
                  <Select 
                    value={formData.category_en} 
                    onValueChange={(value) => setFormData({ ...formData, category_en: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.en.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="icon_name">الأيقونة</Label>
                  <Select 
                    value={formData.icon_name} 
                    onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأيقونة" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {renderIcon(icon)}
                            {icon}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort_order">ترتيب العرض</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
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
                  {editingTool ? 'تحديث' : 'إضافة'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className={`${!tool.active ? 'opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderIcon(tool.icon_name)}
                  <span className="truncate">{tool.name_ar}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(tool)}
                  >
                    {tool.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(tool)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(tool.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{tool.description_ar}</p>
                <p className="text-xs text-primary">{tool.category_ar}</p>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  زيارة الأداة
                </a>
                <p className="text-sm">ترتيب العرض: {tool.sort_order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">لم يتم إضافة أي أدوات بعد</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToolsManager;