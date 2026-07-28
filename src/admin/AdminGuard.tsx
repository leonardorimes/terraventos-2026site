import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from './auth/AdminAuthContext';

export default function AdminGuard() {
  const { session, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <div className="admin-guard-loading">Carregando…</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
