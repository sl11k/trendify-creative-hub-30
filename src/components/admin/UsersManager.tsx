import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Users, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const UsersManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    active: true
  });

  const roles = [
    { value: 'super_admin', label: isRTL ? 'مدير عام' : 'Super Admin' },
    { value: 'admin', label: isRTL ? 'مدير' : 'Admin' },
    { value: 'editor', label: isRTL ? 'محرر' : 'Editor' },
    { value: 'viewer', label: isRTL ? 'مشاهد' : 'Viewer' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            email: formData.email,
            role: formData.role
          })
          .eq('id', editingUser.id);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث بنجاح' : 'Updated Successfully',
          description: isRTL ? 'تم تحديث المستخدم بنجاح' : 'User updated successfully'
        });
      } else {
        // In a real app, you'd hash the password
        const { error } = await supabase
          .from('admin_users')
          .insert([{
            email: formData.email,
            password_hash: formData.password, // This should be hashed in production
            role: formData.role
          }]);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الإضافة بنجاح' : 'Added Successfully',
          description: isRTL ? 'تم إضافة المستخدم بنجاح' : 'User added successfully'
        });
      }
      
      resetForm();
      loadUsers();
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving user',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (user: AdminUser) => {
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      active: true
    });
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(isRTL ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الحذف بنجاح' : 'Deleted Successfully',
          description: isRTL ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully'
        });
        
        loadUsers();
      } catch (error) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'حدث خطأ أثناء الحذف' : 'Error deleting user',
          variant: 'destructive'
        });
      }
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      // For now, we'll just show a message since active field doesn't exist in the database
      toast({
        title: isRTL ? 'ميزة قادمة' : 'Coming Soon',
        description: isRTL ? 'إدارة حالة المستخدمين ستتوفر قريباً' : 'User status management coming soon'
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء التحديث' : 'Error updating user status',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      role: 'admin',
      active: true
    });
    setEditingUser(null);
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
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          {isRTL ? 'إدارة المستخدمين' : 'Users Management'}
        </h2>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {isRTL ? 'إضافة مستخدم' : 'Add User'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser 
                  ? (isRTL ? 'تعديل المستخدم' : 'Edit User')
                  : (isRTL ? 'إضافة مستخدم جديد' : 'Add New User')
                }
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              {!editingUser && (
                <div>
                  <Label>{isRTL ? 'كلمة المرور' : 'Password'}</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}
              
              <div>
                <Label>{isRTL ? 'الدور' : 'Role'}</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>{isRTL ? 'نشط' : 'Active'}</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  {user.email}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'الدور:' : 'Role:'}
                  </span>
                  <span className="text-sm font-medium">
                    {roles.find(r => r.value === user.role)?.label || user.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'الحالة:' : 'Status:'}
                  </span>
                  <Switch
                    checked={true}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {isRTL ? 'تاريخ الإنشاء:' : 'Created:'} {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersManager;