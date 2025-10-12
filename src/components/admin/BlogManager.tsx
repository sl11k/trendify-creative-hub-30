import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Plus, Edit, Trash2, Upload, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BlogManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    content_ar: '',
    content_en: '',
    excerpt_ar: '',
    excerpt_en: '',
    image_url: '',
    published: false,
    keywords_ar: [] as string[],
    keywords_en: [] as string[],
    meta_description_ar: '',
    meta_description_en: '',
    canonical_url: ''
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading blogs:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'حدث خطأ في تحميل المقالات' : 'Error loading blogs',
          variant: 'destructive'
        });
        setBlogs([]);
        return;
      }
      
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ في تحميل المقالات' : 'Error loading blogs',
        variant: 'destructive'
      });
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      content_ar: '',
      content_en: '',
      excerpt_ar: '',
      excerpt_en: '',
      image_url: '',
      published: false,
      keywords_ar: [],
      keywords_en: [],
      meta_description_ar: '',
      meta_description_en: '',
      canonical_url: ''
    });
    setEditingBlog(null);
  };

  const handleEdit = (blog: any) => {
    setFormData({
      title_ar: blog.title_ar || '',
      title_en: blog.title_en || '',
      content_ar: blog.content_ar || '',
      content_en: blog.content_en || '',
      excerpt_ar: blog.excerpt_ar || '',
      excerpt_en: blog.excerpt_en || '',
      image_url: blog.image_url || '',
      published: blog.published || false,
      keywords_ar: blog.keywords_ar || [],
      keywords_en: blog.keywords_en || [],
      meta_description_ar: blog.meta_description_ar || '',
      meta_description_en: blog.meta_description_en || '',
      canonical_url: blog.canonical_url || ''
    });
    setEditingBlog(blog);
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const blogData = {
        ...formData,
        keywords_ar: Array.isArray(formData.keywords_ar) ? formData.keywords_ar : String(formData.keywords_ar).split(',').map(k => k.trim()).filter(k => k),
        keywords_en: Array.isArray(formData.keywords_en) ? formData.keywords_en : String(formData.keywords_en).split(',').map(k => k.trim()).filter(k => k)
      };

      let result;
      if (editingBlog) {
        result = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);
      } else {
        result = await supabase
          .from('blogs')
          .insert([blogData]);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully',
        description: isRTL ? 'تم حفظ المقال بنجاح' : 'Blog post saved successfully'
      });
      
      resetForm();
      setShowDialog(false);
      loadBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving blog post',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: isRTL ? 'تم الحذف بنجاح' : 'Deleted Successfully',
        description: isRTL ? 'تم حذف المقال بنجاح' : 'Blog post deleted successfully'
      });
      
      loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحذف' : 'Error deleting blog post',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll use a placeholder URL since we don't have storage bucket set up
    // In a real implementation, you would upload to Supabase Storage
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ ...formData, image_url: e.target?.result as string });
    };
    reader.readAsDataURL(file);
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
        <h2 className="text-2xl font-bold">{isRTL ? 'إدارة المدونة' : 'Blog Management'}</h2>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowDialog(true); }} className="gap-2">
              <Plus className="h-4 w-4" />
              {isRTL ? 'مقال جديد' : 'New Post'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? (isRTL ? 'تعديل المقال' : 'Edit Post') : (isRTL ? 'مقال جديد' : 'New Post')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{isRTL ? 'العنوان بالعربية' : 'Title (Arabic)'}</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder={isRTL ? 'العنوان بالعربية' : 'Arabic Title'}
                  />
                </div>
                <div>
                  <Label>{isRTL ? 'العنوان بالإنجليزية' : 'Title (English)'}</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder={isRTL ? 'العنوان بالإنجليزية' : 'English Title'}
                  />
                </div>
              </div>

              {/* Excerpt Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{isRTL ? 'المقتطف بالعربية' : 'Excerpt (Arabic)'}</Label>
                  <Textarea
                    value={formData.excerpt_ar}
                    onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                    placeholder={isRTL ? 'المقتطف بالعربية' : 'Arabic Excerpt'}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>{isRTL ? 'المقتطف بالإنجليزية' : 'Excerpt (English)'}</Label>
                  <Textarea
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                    placeholder={isRTL ? 'المقتطف بالإنجليزية' : 'English Excerpt'}
                    rows={3}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label>{isRTL ? 'صورة المقال' : 'Featured Image'}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4" />
                </div>
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="mt-2 w-32 h-20 object-cover rounded border"
                  />
                )}
              </div>

              {/* Content Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{isRTL ? 'المحتوى بالعربية' : 'Content (Arabic)'}</Label>
                  <Textarea
                    value={formData.content_ar}
                    onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                    placeholder={isRTL ? 'المحتوى بالعربية' : 'Arabic Content'}
                    rows={8}
                  />
                </div>
                <div>
                  <Label>{isRTL ? 'المحتوى بالإنجليزية' : 'Content (English)'}</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    placeholder={isRTL ? 'المحتوى بالإنجليزية' : 'English Content'}
                    rows={8}
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{isRTL ? 'الكلمات المفتاحية (عربي)' : 'Keywords (Arabic)'}</Label>
                  <Input
                    value={Array.isArray(formData.keywords_ar) ? formData.keywords_ar.join(', ') : formData.keywords_ar}
                    onChange={(e) => setFormData({ ...formData, keywords_ar: e.target.value.split(',').map(k => k.trim()) as any })}
                    placeholder={isRTL ? 'اكتب الكلمات مفصولة بفاصلة' : 'Comma-separated keywords'}
                  />
                </div>
                <div>
                  <Label>{isRTL ? 'الكلمات المفتاحية (إنجليزي)' : 'Keywords (English)'}</Label>
                  <Input
                    value={Array.isArray(formData.keywords_en) ? formData.keywords_en.join(', ') : formData.keywords_en}
                    onChange={(e) => setFormData({ ...formData, keywords_en: e.target.value.split(',').map(k => k.trim()) as any })}
                    placeholder={isRTL ? 'اكتب الكلمات مفصولة بفاصلة' : 'Comma-separated keywords'}
                  />
                </div>
              </div>

              {/* Publication Status */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>{isRTL ? 'نشر المقال' : 'Publish Post'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'جعل المقال مرئياً للزوار' : 'Make post visible to visitors'}
                  </p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {isRTL ? blog.title_ar : blog.title_en}
                    </h3>
                    <div className="flex items-center gap-2">
                      {blog.published ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {isRTL ? 'منشور' : 'Published'}
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          {isRTL ? 'مسودة' : 'Draft'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isRTL ? blog.excerpt_ar : blog.excerpt_en}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {blog.published && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/blog/${blog.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(blog)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;