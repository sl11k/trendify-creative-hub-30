import { supabase } from '@/integrations/supabase/client';

export const useUpdateSeo = () => {
  const updateServicesPageSeo = async () => {
    const { error } = await supabase
      .from('page_seo')
      .update({
        title_en: 'AI-Powered Business Solutions & Digital Transformation | Trendify',
        title_ar: 'حلول الأعمال بالذكاء الاصطناعي والتحول الرقمي | ترينديفاي',
        description_en: 'Transform your business with Trendify\'s AI-powered solutions. Smart websites, predictive analytics, automated marketing & full digital transformation in Saudi Arabia.',
        description_ar: 'حوّل أعمالك بحلول ترينديفاي الذكية. مواقع ذكية، تحليلات تنبؤية، تسويق آلي وتحول رقمي شامل في السعودية.',
        keywords_en: [
          'artificial intelligence business tools',
          'smart business solutions',
          'digital transformation services',
          'AI analytics',
          'digital transformation in Saudi Arabia',
          'business growth strategy',
          'AI-powered marketing',
          'smart project management',
          'AI for startups',
          'AI and digital transformation solutions',
          'integrated AI platform for business',
          'digital transformation partner',
          'smart decision-making tools',
          'data-driven business growth',
          'AI-powered digital strategy',
          'business automation tools'
        ],
        keywords_ar: [
          'أدوات الأعمال بالذكاء الاصطناعي',
          'حلول الأعمال الذكية',
          'خدمات التحول الرقمي',
          'تحليلات الذكاء الاصطناعي',
          'التحول الرقمي في السعودية',
          'استراتيجية نمو الأعمال',
          'التسويق بالذكاء الاصطناعي',
          'إدارة المشاريع الذكية',
          'الذكاء الاصطناعي للشركات الناشئة',
          'حلول التحول الرقمي بالذكاء الاصطناعي',
          'منصة ذكاء اصطناعي متكاملة للأعمال',
          'شريك التحول الرقمي',
          'أدوات اتخاذ القرار الذكي',
          'نمو الأعمال المدفوع بالبيانات',
          'استراتيجية رقمية بالذكاء الاصطناعي',
          'أدوات أتمتة الأعمال'
        ],
        canonical_url: 'https://trendify.com/services'
      })
      .eq('page_slug', 'services');

    return { error };
  };

  return { updateServicesPageSeo };
};
