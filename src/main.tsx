import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced error logging for iOS Safari debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    error: e.error,
    stack: e.error?.stack
  });
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', {
    reason: e.reason,
    promise: e.promise
  });
});

// Initialize app with comprehensive error handling
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log('App initialized successfully');
} catch (error) {
  console.error('Failed to initialize app:', error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : '';
  document.body.innerHTML = '<div style="padding:20px;text-align:center;direction:rtl;font-family:Arial,sans-serif"><h1>خطأ في التحميل</h1><p>' + errorMessage + '</p><pre style="text-align:left;overflow:auto;padding:10px;background:#f5f5f5">' + errorStack + '</pre></div>';
}
