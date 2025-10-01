import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; direction: rtl; font-family: Arial;">
        <h1 style="color: #8b5cf6;">خطأ في تحميل التطبيق</h1>
        <p>حدث خطأ أثناء تحميل الموقع</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 5px; cursor: pointer;">
          إعادة تحميل
        </button>
      </div>
    `;
  }
} else {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; direction: rtl;">
      <h1>خطأ: عنصر root غير موجود</h1>
    </div>
  `;
}
