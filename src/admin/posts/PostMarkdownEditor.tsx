import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PostMarkdownEditor.css';

interface PostMarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PostMarkdownEditor({ label, value, onChange }: PostMarkdownEditorProps) {
  return (
    <div className="post-md-editor">
      <div className="post-md-pane">
        <span className="post-md-pane-label">{label} (Markdown)</span>
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={16} />
      </div>
      <div className="post-md-pane">
        <span className="post-md-pane-label">Preview</span>
        <div className="post-md-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '_Nada para mostrar ainda…_'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
