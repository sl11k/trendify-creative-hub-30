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
    'nav.contact': 'تواصل معنا',

    // Hero Section
    'hero.title': 'Trendify',
    'hero.subtitle': 'حلول رقمية ذكية ومنتجات تقنية حديثة — نساعد الشركات ورواد الأعمال على تحويل الأفكار إلى منتجات وتجارب رقمية قابلة للنمو.',
    'hero.cta.primary': 'تواصل معنا',
    'hero.cta.secondary': 'اكتشف أعمالنا',

    // Services
    'services.title': 'خدماتنا التقنية',
    'services.subtitle': 'حلول متكاملة تجمع بين التقنية، التصميم، والذكاء الاصطناعي.',
    'services.digital-marketing.title': 'الحلول الرقمية',
    'services.digital-marketing.desc': 'تطوير المنصات والتطبيقات والأنظمة الحديثة وفق أعلى معايير الجودة.',
    'services.web-dev.title': 'تطوير المنتجات الرقمية',
    'services.web-dev.desc': 'تحويل الأفكار إلى منتجات قابلة للإطلاق والنمو، من النموذج الأولي حتى المنتج النهائي.',
    'services.graphic-design.title': 'حلول الذكاء الاصطناعي',
    'services.graphic-design.desc': 'أنظمة وأدوات ذكية لتحسين التشغيل وتجربة المستخدم وأتمتة العمليات.',
    'services.photography.title': 'تصميم تجربة المستخدم',
    'services.photography.desc': 'تصميم واجهات وتجارب استخدام حديثة وسلسة تركز على المستخدم.',
    'services.social-media.title': 'منصات SaaS وأنظمة مؤسسية',
    'services.social-media.desc': 'بناء منصات SaaS متعددة المستخدمين وأنظمة مؤسسية تدعم النمو والتوسع.',
    'services.content-writing.title': 'أدوات الأتمتة',
    'services.content-writing.desc': 'حلول أتمتة ذكية تدعم الكفاءة التشغيلية وتختصر الوقت والجهد.',

    // About
    'about.title': 'من نحن',
    'about.subtitle': 'شريكك التقني لبناء حلول رقمية تدوم',
    'about.description': 'تأسست Trendify عام 2023 كشركة متخصصة في تطوير الحلول الرقمية والمنتجات الذكية، مع تركيز على هندسة البرمجيات وبناء الأنظمة الرقمية الحديثة. نساعد الشركات ورواد الأعمال على تحويل الأفكار إلى منتجات وتجارب رقمية قابلة للنمو، من خلال الجمع بين التقنية، التصميم، والذكاء الاصطناعي.',

    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'دعنا نبني معك حلًا رقميًا يدوم.',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.service': 'الخدمة المطلوبة',
    'contact.form.message': 'رسالتك',
    'contact.form.submit': 'إرسال الرسالة',

    // Footer
    'footer.description': 'Trendify — نبني أنظمة رقمية طويلة الأمد، لا مشاريع مؤقتة.',
    'footer.rights': 'جميع الحقوق محفوظة',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.portfolio': 'Our Work',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.title': 'Trendify',
    'hero.subtitle': 'Smart digital solutions and modern tech products — helping companies and entrepreneurs turn ideas into scalable digital products and experiences.',
    'hero.cta.primary': 'Get in Touch',
    'hero.cta.secondary': 'Explore Our Work',

    // Services
    'services.title': 'Our Tech Services',
    'services.subtitle': 'Integrated solutions combining technology, design, and AI.',
    'services.digital-marketing.title': 'Digital Solutions',
    'services.digital-marketing.desc': 'Building modern platforms, applications, and systems to the highest quality standards.',
    'services.web-dev.title': 'Digital Product Development',
    'services.web-dev.desc': 'Turning ideas into launch-ready, scalable products — from prototype to final product.',
    'services.graphic-design.title': 'AI Solutions',
    'services.graphic-design.desc': 'Smart systems and tools that improve operations, user experience, and process automation.',
    'services.photography.title': 'UX Design',
    'services.photography.desc': 'Modern, seamless, user-centered interfaces and experiences.',
    'services.social-media.title': 'SaaS & Enterprise Systems',
    'services.social-media.desc': 'Multi-tenant SaaS platforms and enterprise systems built to scale with you.',
    'services.content-writing.title': 'Automation Tools',
    'services.content-writing.desc': 'Smart automation that boosts operational efficiency and saves time.',

    // About
    'about.title': 'About Us',
    'about.subtitle': 'Your Tech Partner for Long-Lasting Digital Solutions',
    'about.description': 'Founded in 2023, Trendify specializes in developing digital solutions and smart products with a strong focus on software engineering and modern digital systems. We help companies and entrepreneurs turn ideas into scalable digital products by combining technology, design, and artificial intelligence.',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Let\'s build a digital solution that lasts.',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.service': 'Required Service',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',

    // Footer
    'footer.description': 'Trendify — We build long-lasting digital systems, not short-term projects.',
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
