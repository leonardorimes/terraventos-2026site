import type { BlogPostRow } from '../../lib/blogPosts';

export type { BlogPostRow };

export type PostFormState = Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'>;

export function emptyPost(): PostFormState {
  return {
    slug: '',
    published: false,
    published_at: null,
    cover_image_url: null,
    cover_image_credit_name: null,
    cover_image_credit_url: null,
    title_pt: '',
    title_en: '',
    title_es: '',
    excerpt_pt: '',
    excerpt_en: '',
    excerpt_es: '',
    content_pt: '',
    content_en: '',
    content_es: '',
  };
}

export function postToFormState(post: BlogPostRow): PostFormState {
  return {
    slug: post.slug,
    published: post.published,
    published_at: post.published_at,
    cover_image_url: post.cover_image_url,
    cover_image_credit_name: post.cover_image_credit_name,
    cover_image_credit_url: post.cover_image_credit_url,
    title_pt: post.title_pt,
    title_en: post.title_en,
    title_es: post.title_es,
    excerpt_pt: post.excerpt_pt,
    excerpt_en: post.excerpt_en,
    excerpt_es: post.excerpt_es,
    content_pt: post.content_pt,
    content_en: post.content_en,
    content_es: post.content_es,
  };
}
