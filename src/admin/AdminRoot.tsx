import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider } from './auth/AdminAuthContext';
import './admin.css';

export default function AdminRoot() {
  // Anti-FOUC: fora da árvore do AppShell, então precisa revelar o #root
  // sozinho (ver o mesmo efeito em AppShell.tsx e o CSS em index.html/App.css).
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.add('app-ready');
        });
      });
    }
  }, []);

  // Painel interno — nunca deve ser indexado por buscadores.
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  return (
    <AdminAuthProvider>
      <Toaster position="bottom-center" />
      <Outlet />
    </AdminAuthProvider>
  );
}
