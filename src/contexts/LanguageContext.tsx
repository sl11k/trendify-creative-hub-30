import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'خدماتنا',
    'nav.portfolio': 'أعمالنا',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل بنا',
    
    // Hero Section
    'hero.title': 'نحول أحلامك الرقمية إلى واقع مبهر',
    'hero.subtitle': 'Trendify - شريكك المتكامل لنمو مشروعك من الفكرة للإطلاق والنجاح - نجعل علامتك التجارية تتألق في العالم الرقمي',
    'hero.cta.primary': 'احصل على استشارة',
    'hero.cta.secondary': 'اكتشف خدماتنا',
    
    // Services
    'services.title': 'خدماتنا المتميزة',
    'services.subtitle': 'نقدم حلولاً شاملة ومبتكرة لجميع احتياجاتك الرقمية والإبداعية',
    'services.digital-marketing.title': 'التسويق الرقمي وتحسين محركات البحث',
    'services.digital-marketing.desc': 'استراتيجيات تسويقية مبتكرة وتحسين SEO لزيادة ظهور علامتك التجارية',
    'services.web-dev.title': 'تطوير المواقع والتطبيقات',
    'services.web-dev.desc': 'مواقع وتطبيقات عصرية ومتجاوبة بأحدث التقنيات والمعايير',
    'services.graphic-design.title': 'التصميم الجرافيكي والهوية البصرية',
    'services.graphic-design.desc': 'تصاميم إبداعية مميزة تعكس شخصية علامتك التجارية',
    'services.photography.title': 'التصوير الفوتوغرافي وإنتاج الفيديو',
    'services.photography.desc': 'محتوى بصري احترافي يحكي قصة علامتك التجارية',
    'services.social-media.title': 'إدارة وسائل التواصل الاجتماعي',
    'services.social-media.desc': 'استراتيجيات محتوى فعالة وإدارة احترافية لحساباتك',
    'services.content-writing.title': 'كتابة المحتوى والنصوص التسويقية',
    'services.content-writing.desc': 'محتوى جذاب ومؤثر يتحدث بلسان جمهورك المستهدف',
    
    // About
    'about.title': 'من نحن',
    'about.subtitle': 'شريكك المتكامل للنمو الرقمي',
    'about.description': 'Trendify منصة متكاملة تجمع بين التقنية والإبداع والاستراتيجية، نساعد الشركات الناشئة والمشاريع على النمو من خلال حلول رقمية ذكية تساعدك على التميز والازدهار في البيئة الرقمية المتطورة.',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'دعنا نساعدك في تحقيق أهدافك الرقمية',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.service': 'الخدمة المطلوبة',
    'contact.form.message': 'رسالتك',
    'contact.form.submit': 'إرسال الرسالة',
    
    // Footer
    'footer.description': 'Trendify - شريكك المتكامل للنمو الرقمي',
    'footer.rights': 'جميع الحقوق محفوظة',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'We Turn Your Digital Dreams Into Stunning Reality',
    'hero.subtitle': 'Trendify - Your Complete Growth Partner from Idea to Launch & Success - We make your brand shine in the digital world',
    'hero.cta.primary': 'Get Consultation',
    'hero.cta.secondary': 'Explore Our Services',
    
    // Services
    'services.title': 'Our Premium Services',
    'services.subtitle': 'We provide comprehensive and innovative solutions for all your digital and creative needs',
    'services.digital-marketing.title': 'Digital Marketing & SEO',
    'services.digital-marketing.desc': 'Innovative marketing strategies and SEO optimization to boost your brand visibility',
    'services.web-dev.title': 'Web & Mobile Development',
    'services.web-dev.desc': 'Modern and responsive websites and applications using latest technologies and standards',
    'services.graphic-design.title': 'Graphic Design & Visual Identity',
    'services.graphic-design.desc': 'Creative distinctive designs that reflect your brand personality',
    'services.photography.title': 'Photography & Video Production',
    'services.photography.desc': 'Professional visual content that tells your brand story',
    'services.social-media.title': 'Social Media Management',
    'services.social-media.desc': 'Effective content strategies and professional management of your accounts',
    'services.content-writing.title': 'Content Writing & Copywriting',
    'services.content-writing.desc': 'Engaging and impactful content that speaks your target audience language',
    
    // About
    'about.title': 'About Us',
    'about.subtitle': 'Your Complete Digital Growth Partner',
    'about.description': 'Trendify is an integrated platform that combines technology, creativity, and strategy. We help startups and projects grow through smart digital solutions that help you stand out and thrive in the evolving digital landscape.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Let us help you achieve your digital goals',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.service': 'Required Service',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',
    
    // Footer
    'footer.description': 'Trendify - Your Complete Digital Growth Partner',
    'footer.rights': 'All Rights Reserved',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Set document direction and font family based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.className = language === 'ar' ? 'rtl font-arabic' : 'ltr font-sans';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};