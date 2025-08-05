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
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isPreviewExiting, setIsPreviewExiting] = useState(false);

  const transitionDuration = 300;
  const fetchDelay = 500;

  const currentHoverIdRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const detailsCacheRef = useRef<Map<number, MovieDetails>>(new Map());

  const handleHover = useCallback(
    async (movie: Movie, element: HTMLElement) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

      const rect = element.getBoundingClientRect();

      currentHoverIdRef.current = movie.id;

      // Handle exit transition before showing new preview
      if (isPreviewOpen || isPreviewExiting) {
        setPreviewOpen(false);
        setIsPreviewExiting(true);

        await new Promise((resolve) => setTimeout(resolve, transitionDuration));
        if (currentHoverIdRef.current !== movie.id) return;

        setIsPreviewExiting(false);
      }

      setPreview({
        movie,
        position: {
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      });

      setMovieDetails(null);
      setPreviewOpen(false);

      fetchTimeoutRef.current = setTimeout(async () => {
        const cancelGuard = () => currentHoverIdRef.current !== movie.id;

        try {
          const cached = detailsCacheRef.current.get(movie.id);
          if (cached && !cancelGuard()) {
            setMovieDetails(cached);
            setPreviewOpen(true);
            return;
          }

          const details = await getMovieDetails(movie.id);
          if (cancelGuard()) return;

          detailsCacheRef.current.set(movie.id, details);
          setMovieDetails(details);
          setPreviewOpen(true);
        } catch (e) {
          if (!cancelGuard()) {
            console.error("Failed to fetch movie details:", e);
          }
        }
      }, fetchDelay);
    },
    [isPreviewOpen, isPreviewExiting]
  );

  const startExit = () => {
    setPreviewOpen(false);
    setIsPreviewExiting(true);

    setTimeout(() => {
      setIsPreviewExiting(false);
      setMovieDetails(null);
      setPreview({ movie: null, position: null });
    }, transitionDuration);
  };

  const handleUnhover = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      startExit();
    }, 200); // delay before exiting
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
    isPreviewExiting,
    isPreviewOpen,
    handleHover,
    handleUnhover,
    cancelUnhover,
  };
}