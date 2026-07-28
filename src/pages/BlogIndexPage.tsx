import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlogCard from '../components/BlogCard';
import { fetchAllPublishedPosts, pickLangFields, toLangCode, type BlogPostRow } from '../lib/blogPosts';
import { toOgImage } from '../utils/seoImages';
import './BlogIndexPage.css';

const POSTS_PER_PAGE = 8;

export default function BlogIndexPage() {
  const { t, i18n } = useTranslation();
  const lang = toLangCode(i18n.language);
  const [rows, setRows] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetchAllPublishedPosts()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const title = `${t('blog.pageTitle', 'Blog')} | Terra Ventos`;
    const description = t(
      'blog.pageDescription',
      'Curadoria de artigos sobre investimento imobiliário e o litoral do Ceará.',
    );
    const imageUrl = `${window.location.origin}${toOgImage('/banners/banners-01.webp')}`;
    const url = window.location.href;

    document.title = title;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', imageUrl, true);
    updateMeta('og:url', url, true);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
  }, [t]);

  const posts = rows.map((row) => pickLangFields(row, lang));
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [rows, lang]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedPosts = useMemo(
    () => posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, lang, currentPage],
  );

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="blog-index-page">
      <div className="container">
        <div className="blog-header">
          <span className="blog-badge">{t('blog.badge', 'Insights & Mercado')}</span>
          <h1 className="blog-index-title">{t('blog.pageTitle', 'Blog')}</h1>
        </div>

        {loading ? (
          <p className="blog-index-status">{t('blog.loading', 'Carregando…')}</p>
        ) : posts.length === 0 ? (
          <p className="blog-index-status">{t('blog.empty', 'Ainda não há posts publicados.')}</p>
        ) : (
          <>
            <div className="blog-index-grid">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} lang={lang} readMoreLabel={t('blog.readMore', 'Leia mais')} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="blog-pagination"
                aria-label={t('blog.pageIndicator', {
                  defaultValue: 'Página {{current}} de {{total}}',
                  current: currentPage,
                  total: totalPages,
                })}
              >
                <button
                  type="button"
                  className="blog-pagination-arrow"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label={t('blog.previousPage', 'Anterior')}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 12H5M5 12L11 18M5 12L11 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="blog-pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`blog-pagination-page${page === currentPage ? ' active' : ''}`}
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="blog-pagination-arrow"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label={t('blog.nextPage', 'Próxima')}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
