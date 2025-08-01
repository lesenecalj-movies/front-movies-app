import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/movie.preview.card.module.scss';

type Props = {
  movie: {
    title: string;
    posterPath: string;
    trailerUrl: string;
    runtime?: number;
    genres?: { name: string }[];
  };
  position: { top: number; left: number; width: number };
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function MoviePreviewCard({
  movie,
  position,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.previewCard}
      style={{
        position: 'absolute',
        top: position.top - position.width * -0.15,
        left: position.left - position.width * 0.25,
        width: position.width * 1.5,
        transform: 'translateY(-20px) scale(1.4)',
        transformOrigin: 'top centers',
        zIndex: 9999,
      }}
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.videoWrapper}>
        <iframe
          src={`${movie.trailerUrl}?autoplay=1&mute=1`}
          title={`${movie.title} Trailer`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div className={styles.info}>
        <h4>{movie.title}</h4>
        <p>{movie.runtime ? `${movie.runtime} min` : ''}</p>
        <p>{movie.genres?.map((g) => g.name).join(' • ')}</p>
      </div>
    </div>,
    document.body,
  );
}
