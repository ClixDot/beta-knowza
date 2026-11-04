import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import { SiteContentProvider } from './cms/hooks/useSiteContent';
import './styles/index.css';

// The admin loads as its own bundle so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const Root: React.FC = () => {
  const { pathname } = useLocation();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#EEF0E6' }} />}>
        <AdminApp />
      </Suspense>
    );
  }
  return (
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);
