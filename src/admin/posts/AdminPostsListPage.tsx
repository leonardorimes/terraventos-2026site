import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listAllPosts, deletePost, togglePublish } from './api';
import type { BlogPostRow } from '../../lib/blogPosts';
import './AdminPostsListPage.css';

export default function AdminPostsListPage() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listAllPosts()
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err) => {
        toast.error('Falha ao carregar posts.');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTogglePublish = async (post: BlogPostRow) => {
    try {
      const updated = await togglePublish(post);
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(updated.published ? 'Post publicado.' : 'Post despublicado.');
    } catch (err) {
      toast.error('Falha ao atualizar status.');
      console.error(err);
    }
  };

  const handleDelete = async (post: BlogPostRow) => {
    if (!window.confirm(`Excluir "${post.title_pt || post.slug}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success('Post excluído.');
    } catch (err) {
      toast.error('Falha ao excluir post.');
      console.error(err);
    }
  };

  return (
    <div className="admin-posts-list">
      <div className="admin-posts-list-header">
        <h1>Posts</h1>
        <Link to="/admin/posts/new" className="admin-btn admin-btn-accent">
          Novo post
        </Link>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : posts.length === 0 ? (
        <p>Nenhum post ainda.</p>
      ) : (
        <table className="admin-posts-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title_pt || '(sem título)'}</td>
                <td>
                  {(() => {
                    const isScheduled =
                      !post.published && !!post.published_at && new Date(post.published_at) > new Date();
                    return (
                      <span
                        className={`admin-status-badge ${
                          post.published ? 'is-published' : isScheduled ? 'is-scheduled' : 'is-draft'
                        }`}
                      >
                        {post.published
                          ? 'Publicado'
                          : isScheduled
                            ? `Agendado · ${new Date(post.published_at as string).toLocaleString('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}`
                            : 'Rascunho'}
                      </span>
                    );
                  })()}
                </td>
                <td>{new Date(post.updated_at).toLocaleDateString('pt-BR')}</td>
                <td className="admin-posts-table-actions">
                  <Link to={`/admin/posts/${post.id}/edit`} className="admin-btn admin-btn-ghost">
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => handleTogglePublish(post)}
                  >
                    {post.published ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(post)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
