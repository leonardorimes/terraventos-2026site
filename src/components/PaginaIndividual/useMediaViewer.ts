import { useState } from 'react';

export function useMediaViewer() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<string | null>(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);

  const openLightbox = (src: string) => {
    setLightboxImage(src);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxVideo(null);
    document.body.style.overflow = isAlbumOpen ? 'hidden' : '';
  };

  const openAlbum = () => {
    setIsAlbumOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAlbum = () => {
    setIsAlbumOpen(false);
    document.body.style.overflow = '';
  };

  const openVideo = (src: string) => {
    setLightboxVideo(src);
    document.body.style.overflow = 'hidden';
  };

  return {
    lightboxImage,
    lightboxVideo,
    isAlbumOpen,
    openLightbox,
    closeLightbox,
    openAlbum,
    closeAlbum,
    openVideo,
  };
}

export type MediaViewer = ReturnType<typeof useMediaViewer>;
