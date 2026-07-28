import { supabase } from './supabaseClient';

export type LangCode = 'pt' | 'en' | 'es';

export interface BlogPostRow {
  id: string;
  slug: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
  cover_image_credit_name: string | null;
  cover_image_credit_url: string | null;
  title_pt: string;
  title_en: string;
  title_es: string;
  excerpt_pt: string;
  excerpt_en: string;
  excerpt_es: string;
  content_pt: string;
  content_en: string;
  content_es: string;
}

export interface LocalizedPost {
  id: string;
  slug: string;
  publishedAt: string | null;
  coverImageUrl: string | null;
  coverImageCreditName: string | null;
  coverImageCreditUrl: string | null;
  title: string;
  excerpt: string;
  content: string;
}

export function toLangCode(lang: string): LangCode {
  return lang === 'en' || lang === 'es' ? lang : 'pt';
}

/** Campos do idioma pedido, com fallback para pt quando en/es estiverem vazios. */
export function pickLangFields(row: BlogPostRow, lang: LangCode): LocalizedPost {
  const title =
    lang === 'en' ? row.title_en || row.title_pt : lang === 'es' ? row.title_es || row.title_pt : row.title_pt;
  const excerpt =
    lang === 'en'
      ? row.excerpt_en || row.excerpt_pt
      : lang === 'es'
        ? row.excerpt_es || row.excerpt_pt
        : row.excerpt_pt;
  const content =
    lang === 'en'
      ? row.content_en || row.content_pt
      : lang === 'es'
        ? row.content_es || row.content_pt
        : row.content_pt;

  return {
    id: row.id,
    slug: row.slug,
    publishedAt: row.published_at,
    coverImageUrl: row.cover_image_url,
    coverImageCreditName: row.cover_image_credit_name,
    coverImageCreditUrl: row.cover_image_credit_url,
    title,
    excerpt,
    content,
  };
}

export async function fetchLatestPublishedPosts(limit = 4): Promise<BlogPostRow[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllPublishedPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
