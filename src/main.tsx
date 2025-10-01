import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error boundary for iOS compatibility
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('ErrorBoundary caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', direction: 'rtl' }}>
          <h1>حدث خطأ في تحميل التطبيق</h1>
          <button onClick={() => window.location.reload()}>إعادة تحميل الصفحة</button>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('App starting...');

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error('Root element not found!');
}
