import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadCoverImage } from './api';
import UnsplashPicker, { type UnsplashSelection } from './UnsplashPicker';
import './CoverImageUploader.css';

const MAX_SIZE_MB = 5;

interface CoverImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  creditName: string | null;
  creditUrl: string | null;
  onCreditChange: (creditName: string | null, creditUrl: string | null) => void;
  suggestedQuery?: string;
}

export default function CoverImageUploader({
  value,
  onChange,
  creditName,
  creditUrl,
  onCreditChange,
  suggestedQuery,
}: CoverImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Imagem muito grande (máx. ${MAX_SIZE_MB}MB).`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCoverImage(file);
      onChange(url);
      onCreditChange(null, null);
      toast.success('Imagem enviada.');
    } catch (err) {
      toast.error('Falha ao enviar imagem.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUnsplashSelect = (selection: UnsplashSelection) => {
    onChange(selection.url);
    onCreditChange(selection.creditName, selection.creditUrl);
    setPickerOpen(false);
    toast.success('Imagem do Unsplash selecionada.');
  };

  const handleRemove = () => {
    onChange(null);
    onCreditChange(null, null);
  };

  return (
    <div className="cover-uploader">
      <span className="admin-field-label">Capa</span>
      {value && (
        <div className="cover-uploader-preview">
          <img src={value} alt="Capa do post" />
          <div className="cover-uploader-preview-info">
            {creditName && (
              <span className="cover-uploader-credit">
                Foto:{' '}
                {creditUrl ? (
                  <a href={creditUrl} target="_blank" rel="noreferrer">
                    {creditName}
                  </a>
                ) : (
                  creditName
                )}{' '}
                / Unsplash
              </span>
            )}
            <button type="button" className="admin-btn admin-btn-ghost" onClick={handleRemove}>
              Remover
            </button>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = '';
        }}
        style={{ display: 'none' }}
      />
      <div className="cover-uploader-actions">
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Enviando…' : value ? 'Trocar imagem de capa' : 'Escolher imagem de capa'}
        </button>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setPickerOpen(true)}>
          Sugerir fotos (Unsplash)
        </button>
      </div>

      {pickerOpen && (
        <UnsplashPicker
          initialQuery={suggestedQuery}
          onSelect={handleUnsplashSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
