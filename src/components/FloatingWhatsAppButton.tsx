import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingWhatsAppButton = () => {
  const { isRTL } = useLanguage();
  const [whatsappConfig, setWhatsappConfig] = useState({
    phone: '+966501234567',
    active: false,
    position: 'bottom-right'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadWhatsAppConfig();
  }, []);

  const loadWhatsAppConfig = async () => {
    try {
      const { data } = await supabase
        .from('whatsapp_button')
        .select('*')
        .single();
      
      if (data) {
        setWhatsappConfig(data);
        setIsVisible(data.active);
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    }
  };

  const handleWhatsAppClick = () => {
    const message = isRTL 
      ? 'مرحباً، أرغب في الاستفسار عن خدماتكم'
      : 'Hello, I would like to inquire about your services';
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = whatsappConfig.phone.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible || !whatsappConfig.active) {
    return null;
  }

  // تحقق من أن المستخدم ليس في صفحة الأدمن
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname.includes('/admin');
  if (isAdminPage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-bounce"
        style={{ animationDuration: '2s' }}
        aria-label={isRTL ? 'تواصل عبر الواتساب' : 'Contact via WhatsApp'}
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isRTL ? 'تواصل معنا عبر الواتساب' : 'Contact us on WhatsApp'}
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </button>
    </div>
  );
};

export default FloatingWhatsAppButton;