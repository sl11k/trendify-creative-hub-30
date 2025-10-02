import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error logging for debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Failed to initialize app:', error);
  document.body.innerHTML = '<div style="padding:20px;text-align:center;direction:rtl"><h1>خطأ في التحميل</h1><p>' + error + '</p></div>';
}
