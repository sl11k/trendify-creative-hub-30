import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

const MaintenanceCheck: React.FC<MaintenanceCheckProps> = ({ children }) => {
  const { isRTL } = useLanguage();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState({
    ar: 'الموقع مغلق مؤقتاً للصيانة. نعتذر عن الإزعاج وسنعود قريباً.',
    en: 'Site is temporarily closed for maintenance. We apologize for the inconvenience and will be back soon.'
  });
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@trendify.agency',
    phone: '+966 50 123 4567',
    address_ar: 'الرياض، المملكة العربية السعودية',
    address_en: 'Riyadh, Saudi Arabia'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      // Check maintenance mode
      const { data: maintenanceSettings } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['maintenance_mode', 'maintenance_message_ar', 'maintenance_message_en']);

      if (maintenanceSettings) {
        const settings = maintenanceSettings.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value;
          return acc;
        }, {} as Record<string, string>);

        const isInMaintenance = settings.maintenance_mode === 'true';
        setIsMaintenanceMode(isInMaintenance);

        if (isInMaintenance) {
          setMaintenanceMessage({
            ar: settings.maintenance_message_ar || maintenanceMessage.ar,
            en: settings.maintenance_message_en || maintenanceMessage.en
          });

          // Load contact info for maintenance page
          const { data: contactSettings } = await supabase
            .from('site_settings')
            .select('*')
            .in('setting_key', ['contact_email', 'contact_phone', 'contact_address_ar', 'contact_address_en']);

          if (contactSettings) {
            const contactData = contactSettings.reduce((acc, item) => {
              acc[item.setting_key] = item.setting_value;
              return acc;
            }, {} as Record<string, string>);

            setContactInfo({
              email: contactData.contact_email || contactInfo.email,
              phone: contactData.contact_phone || contactInfo.phone,
              address_ar: contactData.contact_address_ar || contactInfo.address_ar,
              address_en: contactData.contact_address_en || contactInfo.address_en
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Trendify</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>

            {/* Maintenance Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {isRTL ? 'موقع تحت الصيانة' : 'Site Under Maintenance'}
              </h2>
            </div>

            {/* Maintenance Message */}
            <div className="mb-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                {isRTL ? maintenanceMessage.ar : maintenanceMessage.en}
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-gray-600">
                    {isRTL ? contactInfo.address_ar : contactInfo.address_en}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500">
              © 2024 Trendify. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceCheck;