import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// iOS Safari compatibility - ensure proper initialization
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found');
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Loading error...</div>';
    return;
  }

  try {
    console.log('Initializing React app...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React app initialized successfully');
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; direction: rtl; font-family: Arial, sans-serif;">
        <h1 style="color: #8b5cf6;">خطأ في تحميل التطبيق</h1>
        <p>حدث خطأ أثناء تحميل الموقع</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
          إعادة تحميل
        </button>
      </div>
    `;
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
