-- إضافة المستخدم الإداري إلى جدول admin_users
INSERT INTO public.admin_users (email, role, active)
VALUES ('m7md4r3al@gmail.com', 'admin', true)
ON CONFLICT (email) DO UPDATE SET active = true, role = 'admin';