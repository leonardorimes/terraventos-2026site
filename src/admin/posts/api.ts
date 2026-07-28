import { supabase } from '../../lib/supabaseClient';
import type { BlogPostRow } from '../../lib/blogPosts';
import type { PostFormState } from './types';

export async function listAllPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase.from('posts').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPostById(id: string): Promise<BlogPostRow | null> {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPost(input: PostFormState): Promise<BlogPostRow> {
  const payload = {
    ...input,
    published_at: input.published ? input.published_at ?? new Date().toISOString() : null,
  };
  const { data, error } = await supabase.from('posts').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updatePost(id: string, input: PostFormState): Promise<BlogPostRow> {
  const payload = {
    ...input,
    published_at: input.published ? input.published_at ?? new Date().toISOString() : input.published_at,
  };
  const { data, error } = await supabase.from('posts').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function togglePublish(post: BlogPostRow): Promise<BlogPostRow> {
  const nextPublished = !post.published;
  const payload = {
    published: nextPublished,
    published_at: nextPublished ? post.published_at ?? new Date().toISOString() : post.published_at,
  };
  const { data, error } = await supabase.from('posts').update(payload).eq('id', post.id).select().single();
  if (error) throw error;
  return data;
}

export async function uploadCoverImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();
  const path = `${crypto.randomUUID()}-${safeName}.${ext}`;

  const { error } = await supabase.storage.from('blog-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
  return data.publicUrl;
}
