import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './auth/AdminAuthContext';
import { ADMIN_NAV_ITEMS } from './navConfig';
import './AdminLayout.css';

export default function AdminLayout() {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Terra Ventos</div>
        <nav className="admin-sidebar-nav">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-sidebar-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="admin-btn admin-btn-ghost admin-sidebar-logout" onClick={handleSignOut}>
          Sair
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
