import { createClient } from '@supabase/supabase-js';

const ALLOWED_FIELDS = [
  'slug',
  'published',
  'published_at',
  'cover_image_url',
  'cover_image_credit_name',
  'cover_image_credit_url',
  'title_pt',
  'title_en',
  'title_es',
  'excerpt_pt',
  'excerpt_en',
  'excerpt_es',
  'content_pt',
  'content_en',
  'content_es',
];

function pickAllowedFields(body) {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const expectedKey = process.env.POSTS_API_SECRET;
  if (!expectedKey) {
    console.error('[posts-api] missing POSTS_API_SECRET');
    return res.status(500).json({ error: 'POSTS_API_SECRET não configurada' });
  }

  const providedKey = req.headers['x-api-key'];
  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[posts-api] missing Supabase service credentials');
    return res.status(500).json({ error: 'Credenciais do Supabase não configuradas' });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    if (req.method === 'GET') {
      const { id, slug } = req.query || {};
      if (!id && !slug) {
        return res.status(400).json({ error: 'Informe id ou slug na query string' });
      }
      let query = supabase.from('posts').select('*');
      query = id ? query.eq('id', id) : query.eq('slug', slug);
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Post não encontrado' });
      return res.status(200).json({ success: true, post: data });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const payload = pickAllowedFields(body);

      if (!payload.slug || !payload.title_pt) {
        return res.status(400).json({ error: 'slug e title_pt são obrigatórios' });
      }
      if (payload.published && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase.from('posts').insert(payload).select().single();
      if (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Esse slug já existe' });
        throw error;
      }
      return res.status(201).json({ success: true, post: data });
    }

    if (req.method === 'PATCH') {
      const body = req.body || {};
      const { id } = body;
      if (!id) {
        return res.status(400).json({ error: 'id é obrigatório para atualizar um post' });
      }

      const payload = pickAllowedFields(body);
      if (payload.published && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase.from('posts').update(payload).eq('id', id).select().maybeSingle();
      if (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Esse slug já existe' });
        throw error;
      }
      if (!data) return res.status(404).json({ error: 'Post não encontrado' });
      return res.status(200).json({ success: true, post: data });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error('[posts-api] internal error:', err);
    return res.status(500).json({ error: 'Erro interno', message: err?.message });
  }
}
