import { getMovieDetails } from "@/services/movie.services";
import { Movie, MovieDetails } from "@/types/movie.types";
import { useRef, useCallback, useState } from "react";

type PreviewState = {
  movie: Movie | null;
  position: { top: number; left: number; width: number } | null;
};

export function useMovieHover() {
  const [preview, setPreview] = useState<PreviewState>({
    movie: null,
    position: null,
  });

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewTargetId, setPreviewTargetId] = useState<number | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const detailsCacheRef = useRef<Map<number, MovieDetails>>(new Map());


  const handleHover = useCallback(
    async (movie: Movie, element: HTMLElement) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const rect = element.getBoundingClientRect();

      setPreview((prev) => ({
        ...prev,
        movie,
        position: {
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      }));

      setMovieDetails(null);
      setPreviewVisible(false);
      setPreviewTargetId(movie.id);

      fetchTimeoutRef.current = setTimeout(async () => {
        const cached = detailsCacheRef.current.get(movie.id);
        if (cached) {
          setMovieDetails(cached);
          setPreviewVisible(true);
        }

        try {
          const movieDetails = await getMovieDetails(movie.id);
          detailsCacheRef.current.set(movie.id, movieDetails);
          setMovieDetails(movieDetails);
          setPreviewVisible(true);
        } catch (e) {
          console.error('Failed to fetch movie details:', e);
        }
      }, 500);

    }, [],
  );

  const handleUnhover = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setPreview({ movie: null, position: null });
      setMovieDetails(null);
      setPreviewVisible(false);
      setPreviewTargetId(null);
    }, 200);
  }, []);

  const cancelUnhover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    hoveredMovie: preview.movie,
    previewPosition: preview.position,
    movieDetails,
    previewTargetId,
    isPreviewVisible,
    handleHover,
    handleUnhover,
    cancelUnhover,
  };
}