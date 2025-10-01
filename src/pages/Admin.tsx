import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if user is an admin using the RPC function
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(data === true);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    // Create admin user automatically on first load
    const createAdminUser = async () => {
      try {
        const response = await fetch('https://sfgwaukvjwcwdvnxklod.supabase.co/functions/v1/create-admin-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          console.log('Admin user created successfully');
        }
      } catch (error) {
        console.log('Admin user might already exist:', error);
      }
    };

    // Only create admin user once
    const hasCreatedAdmin = localStorage.getItem('admin_user_created');
    if (!hasCreatedAdmin) {
      createAdminUser();
      localStorage.setItem('admin_user_created', 'true');
    }

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (error) throw error;

      // Check if user is an admin
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin');
      
      if (adminError) throw adminError;

      if (!isAdminData) {
        await supabase.auth.signOut();
        throw new Error('ليس لديك صلاحيات الوصول لهذه الصفحة');
      }

      setIsAuthenticated(true);
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في لوحة التحكم'
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: 'تم تسجيل الخروج',
      description: 'تم تسجيل خروجك بنجاح'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gradient-primary">لوحة التحكم</CardTitle>
            <CardDescription>تسجيل الدخول للوصول إلى إعدادات الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="البريد الإلكتروني"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="كلمة المرور"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminPage;