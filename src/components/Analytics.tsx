import React, { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsProps {
  pageSlug?: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ pageSlug = 'home' }) => {
  useAnalytics();
  
  return null; // This component only handles side effects
};

export default Analytics;