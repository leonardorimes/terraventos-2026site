import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPostById, createPost, updatePost } from './api';
import { emptyPost, postToFormState, type PostFormState } from './types';
import { slugify } from '../../utils/slugify';
import PostMarkdownEditor from './PostMarkdownEditor';
import CoverImageUploader from './CoverImageUploader';
import './AdminPostEditorPage.css';

type LangTab = 'pt' | 'en' | 'es';
type LangField = 'title' | 'excerpt' | 'content';

const LANG_LABELS: Record<LangTab, string> = { pt: 'Português', en: 'English', es: 'Español' };

function getLangField(form: PostFormState, lang: LangTab, field: LangField): string {
  if (field === 'title') return lang === 'en' ? form.title_en : lang === 'es' ? form.title_es : form.title_pt;
  if (field === 'excerpt') return lang === 'en' ? form.excerpt_en : lang === 'es' ? form.excerpt_es : form.excerpt_pt;
  return lang === 'en' ? form.content_en : lang === 'es' ? form.content_es : form.content_pt;
}

function withLangField(form: PostFormState, lang: LangTab, field: LangField, value: string): PostFormState {
  if (field === 'title') {
    if (lang === 'pt') return { ...form, title_pt: value };
    if (lang === 'en') return { ...form, title_en: value };
    return { ...form, title_es: value };
  }
  if (field === 'excerpt') {
    if (lang === 'pt') return { ...form, excerpt_pt: value };
    if (lang === 'en') return { ...form, excerpt_en: value };
    return { ...form, excerpt_es: value };
  }
  if (lang === 'pt') return { ...form, content_pt: value };
  if (lang === 'en') return { ...form, content_en: value };
  return { ...form, content_es: value };
}

export default function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState<PostFormState>(emptyPost());
  const [activeTab, setActiveTab] = useState<LangTab>('pt');
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !id) return;
    let cancelled = false;
    getPostById(id)
      .then((post) => {
        if (cancelled) return;
        if (!post) {
          toast.error('Post não encontrado.');
          navigate('/admin/posts', { replace: true });
          return;
        }
        setForm(postToFormState(post));
        setSlugTouched(true);
      })
      .catch((err) => {
        toast.error('Falha ao carregar post.');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isNew, navigate]);

  const handleLangFieldChange = (field: LangField, value: string) => {
    setForm((prev) => {
      const next = withLangField(prev, activeTab, field, value);
      if (activeTab === 'pt' && field === 'title' && !slugTouched) {
        return { ...next, slug: slugify(value) };
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!form.title_pt.trim()) {
      toast.error('Título (PT) é obrigatório.');
      setActiveTab('pt');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const created = await createPost(form);
        toast.success('Post criado.');
        navigate(`/admin/posts/${created.id}/edit`, { replace: true });
      } else if (id) {
        await updatePost(id, form);
        toast.success('Post salvo.');
      }
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      if (code === '23505') {
        toast.error('Esse slug já existe — escolha outro.');
      } else {
        toast.error('Falha ao salvar post.');
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando…</p>;

  return (
    <div className="admin-post-editor">
      <div className="admin-post-editor-header">
        <h1>{isNew ? 'Novo post' : 'Editar post'}</h1>
        <div className="admin-post-editor-header-actions">
          <label className="admin-publish-toggle">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))}
            />
            Publicado
          </label>
          <button type="button" className="admin-btn admin-btn-accent" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="admin-post-editor-meta">
        <label className="admin-field">
          <span className="admin-field-label">Slug</span>
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((prev) => ({ ...prev, slug: event.target.value }));
            }}
          />
        </label>
        <CoverImageUploader
          value={form.cover_image_url}
          onChange={(url) => setForm((prev) => ({ ...prev, cover_image_url: url }))}
          creditName={form.cover_image_credit_name}
          creditUrl={form.cover_image_credit_url}
          onCreditChange={(creditName, creditUrl) =>
            setForm((prev) => ({ ...prev, cover_image_credit_name: creditName, cover_image_credit_url: creditUrl }))
          }
          suggestedQuery={form.title_pt}
        />
      </div>

      <div className="admin-lang-tabs">
        {(['pt', 'en', 'es'] as LangTab[]).map((lang) => (
          <button
            key={lang}
            type="button"
            className={`admin-lang-tab${activeTab === lang ? ' is-active' : ''}`}
            onClick={() => setActiveTab(lang)}
          >
            {LANG_LABELS[lang]}
          </button>
        ))}
      </div>

      <div className="admin-post-editor-fields">
        <label className="admin-field">
          <span className="admin-field-label">
            Título ({activeTab.toUpperCase()}){activeTab === 'pt' && ' *'}
          </span>
          <input
            value={getLangField(form, activeTab, 'title')}
            onChange={(event) => handleLangFieldChange('title', event.target.value)}
          />
        </label>
        <label className="admin-field">
          <span className="admin-field-label">Resumo ({activeTab.toUpperCase()})</span>
          <textarea
            rows={3}
            value={getLangField(form, activeTab, 'excerpt')}
            onChange={(event) => handleLangFieldChange('excerpt', event.target.value)}
          />
        </label>
        <PostMarkdownEditor
          label={`Conteúdo (${activeTab.toUpperCase()})`}
          value={getLangField(form, activeTab, 'content')}
          onChange={(value) => handleLangFieldChange('content', value)}
        />
      </div>
    </div>
  );
}
