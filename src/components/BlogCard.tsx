import LocalizedLink from '../router/LocalizedLink';
import type { LocalizedPost } from '../lib/blogPosts';
import './BlogCard.css';

interface BlogCardProps {
  post: LocalizedPost;
  lang: string;
  readMoreLabel: string;
}

export default function BlogCard({ post, lang, readMoreLabel }: BlogCardProps) {
  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : lang, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : '';

  return (
    <LocalizedLink to={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-image">
        {post.coverImageUrl && <img src={post.coverImageUrl} alt={post.title} loading="lazy" />}
        {dateLabel && <div className="blog-card-date">{dateLabel}</div>}
      </div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-summary">{post.excerpt}</p>
        <span className="blog-read-more">
          {readMoreLabel}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </LocalizedLink>
  );
}
