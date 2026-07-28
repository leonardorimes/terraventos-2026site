import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlogCard from './BlogCard';
import LocalizedLink from '../router/LocalizedLink';
import { fetchLatestPublishedPosts, pickLangFields, toLangCode, type BlogPostRow } from '../lib/blogPosts';
import './BlogSection.css';

export default function BlogSection() {
  const { t, i18n } = useTranslation();
  const lang = toLangCode(i18n.language);
  const [rows, setRows] = useState<BlogPostRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchLatestPublishedPosts(4)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, []);

  if (rows.length === 0) return null;

  const posts = rows.map((row) => pickLangFields(row, lang));

  return (
    <section className="blog-section">
      <div className="container">
        <div className="blog-header">
          <span className="blog-badge">{t('blog.badge', 'Insights & Mercado')}</span>
          <h2 className="blog-title" dangerouslySetInnerHTML={{ __html: t('blog.title', 'ACOMPANHE NOSSA<br />CURADORIA NO BLOG') }}></h2>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} lang={lang} readMoreLabel={t('blog.readMore', 'Leia mais')} />
          ))}
        </div>

        <div className="blog-footer">
          <LocalizedLink to="/blog" className="blog-all-link">
            {t('blog.viewAll', 'Ver todos os artigos')}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
