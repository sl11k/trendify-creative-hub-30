import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    // Check for stored auth
    const storedAuth = localStorage.getItem('admin_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedEmail = loginData.email.trim().toLowerCase();
    if (normalizedEmail !== 'm7md4r3al@gmail.com') {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'البريد الإلكتروني غير صحيح',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (loginData.password === 'Nsm123123_') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم'
        });
      } else {
        throw new Error('كلمة المرور غير صحيحة');
      }

    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'كلمة المرور غير صحيحة',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    toast({
      title: 'تم تسجيل الخروج',
      description: 'تم تسجيل خروجك بنجاح'
    });
  };

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
                />
              </div>
              <Button type="submit" className="w-full">
                تسجيل الدخول
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