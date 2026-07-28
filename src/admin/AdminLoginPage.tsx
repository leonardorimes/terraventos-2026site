import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAdminAuth } from './auth/AdminAuthContext';
import './AdminLoginPage.css';

interface LocationState {
  from?: { pathname?: string };
}

export default function AdminLoginPage() {
  const { session } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) return;
    const from = (location.state as LocationState | null)?.from?.pathname || '/admin/posts';
    navigate(from, { replace: true });
  }, [session, location.state, navigate]);

  if (session) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      toast.error('Email ou senha inválidos.');
      return;
    }
    navigate('/admin/posts', { replace: true });
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Terra Ventos</h1>
        <p className="admin-login-subtitle">Painel interno</p>

        <label className="admin-login-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </label>

        <label className="admin-login-field">
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className="admin-btn admin-btn-primary admin-login-submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
