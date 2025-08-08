import { useMovieTrailer } from '@/hooks/useMovie';
import { Movie } from '@/types/movie.types';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/hover.preview.card.module.scss';

type Props = {
  movie: Movie & {
    runtime?: number;
    genres?: { name: string }[];
  };
  position: { top: number; left: number; width: number };
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isPreviewOpen: boolean;
  isPreviewExiting: boolean;
};

export default function MoviePreviewCard({
  movie,
  position,
  onClose,
  onMouseEnter,
  onMouseLeave,
  isPreviewOpen,
  isPreviewExiting,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { data: trailer } = useMovieTrailer(movie.id);

  const videoUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&modestbranding=1&rel=0`
    : null;

  useEffect(() => {
    setMounted(true);

    requestAnimationFrame(() => {
      setAnimate(true);
    });

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

  const classNames = [styles.previewCard];
  if (animate && isPreviewOpen) classNames.push(styles.enter);
  if (isPreviewExiting) classNames.push(styles.exit);

  return ReactDOM.createPortal(
    <div
      className={classNames.join(' ')}
      style={{
        top: position.top - position.width * -0.15,
        left: position.left - position.width * 0.25,
        width: position.width * 1.5,
      }}
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.videoWrapper}>
        {videoUrl && (
          <iframe
            src={videoUrl}
            title={`${movie.title} Trailer`}
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ overflow: 'hidden', border: 'none' }}
          />
        )}
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
