# Setup Auto Blog Generation Cron Job

تعليمات لإعداد التوليد التلقائي للمقالات كل 24 ساعة:

## الخطوة 1: تفعيل الامتدادات المطلوبة

افتح Supabase SQL Editor وقم بتنفيذ:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## الخطوة 2: إنشاء Cron Job

نفّذ هذا الكود لجدولة التوليد التلقائي كل يوم في الساعة 9 صباحاً:

```sql
SELECT cron.schedule(
  'auto-generate-daily-blog',
  '0 9 * * *', -- كل يوم الساعة 9 صباحاً بتوقيت السيرفر
  $$
  SELECT
    net.http_post(
        url:='https://sfgwaukvjwcwdvnxklod.supabase.co/functions/v1/auto-generate-blog',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ3dhdWt2andjd2R2bnhrbG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjQyNTcsImV4cCI6MjA3MjE0MDI1N30.bM2hbn8mycmjv5Uqeax1zblJEHZrF-l39dCUBVjjCBc"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
```

## الخطوة 3: التحقق من Cron Jobs

للتحقق من الـ Cron Jobs المفعّلة:

```sql
SELECT * FROM cron.job;
```

## الخطوة 4: حذف Cron Job (إذا لزم الأمر)

لحذف الـ Cron Job:

```sql
SELECT cron.unschedule('auto-generate-daily-blog');
```

## خيارات الجدولة

يمكنك تغيير وقت التوليد حسب رغبتك:

- `0 9 * * *` - كل يوم الساعة 9 صباحاً
- `0 12 * * *` - كل يوم الساعة 12 ظهراً
- `0 18 * * *` - كل يوم الساعة 6 مساءً
- `0 9 * * 1` - كل اثنين الساعة 9 صباحاً
- `0 */12 * * *` - كل 12 ساعة

## ملاحظات مهمة

1. **التوقيت**: الأوقات بتوقيت UTC، قد تحتاج لضبطها حسب توقيتك المحلي
2. **الرصيد**: تأكد من وجود رصيد كافٍ في Lovable AI
3. **المراقبة**: راقب Edge Function Logs للتأكد من نجاح العملية
4. **التكرار**: النظام سيولد مقالة جديدة كل 24 ساعة تلقائياً

## استراتيجية بناء Backlinks

المقالات المولدة تلقائياً ستساعد في:

✅ **محتوى منتظم**: مقالة يومية = 365 مقالة في السنة
✅ **تنوع المواضيع**: 10+ مواضيع مختلفة تغطي جميع خدماتك
✅ **SEO محسّن**: كل مقالة محسّنة بالكامل لمحركات البحث
✅ **صور AI**: صور احترافية مولدة بالذكاء الاصطناعي
✅ **محتوى فريد**: كل مقالة مكتوبة من الصفر بمعلومات جديدة
✅ **Backlinks طبيعية**: محتوى قيّم يجذب روابط طبيعية من مواقع أخرى

### خطوات إضافية لبناء Backlinks:

1. **مشاركة على Social Media**: شارك كل مقالة على LinkedIn, Twitter, Facebook
2. **Guest Posting**: استخدم المقالات للنشر على مواقع أخرى مع رابط لموقعك
3. **Directory Submission**: سجّل الموقع في أدلة الأعمال السعودية
4. **Business Partnerships**: تبادل الروابط مع شركاء الأعمال
5. **Press Releases**: حوّل بعض المقالات إلى بيانات صحفية
6. **Forum Participation**: شارك في منتديات تقنية مع روابط للمقالات المفيدة

