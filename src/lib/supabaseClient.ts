import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Não lança erro aqui: isso corre na inicialização do módulo, e como o
  // blog é importado pela home (BlogSection), um throw síncrono derruba o
  // app inteiro (tela branca em todo o site) em vez de só desativar o blog.
  // eslint-disable-next-line no-console
  console.error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam estar definidas (.env.local ou nas env vars do Vercel). Recursos de blog/admin ficarão indisponíveis.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key');
