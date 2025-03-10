import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/movies.module.css";
import MovieCard from "./MovieCard";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  popularity: number;
  backdrop_path: string;
};

export default function GridMovieDisplay({ active }: { active: boolean }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (active) fetchPopularMovies();
  }, [active]);

  const fetchPopularMovies = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3001/movies/popular?page=${page}`
      );
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data: {
        page: number;
        results: Movie[];
        total_pages: number;
        total_results: number;
      } = await res.json();
      setMovies((prevMovies) => {
        const movieSet = new Set(prevMovies.map((m) => m.id));
        const newMovies = data.results.filter(
          (movie) => !movieSet.has(movie.id)
        );
        return [...prevMovies, ...newMovies];
      });
      setNextPage(page + 1);
      setHasMore(data.results.length > 0);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchPopularMovies();
          }
        },
        { rootMargin: "100px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, fetchPopularMovies]
  );

  return (
    <div className={styles.grid}>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          lastMovieRef={index === movies.length - 1 ? lastMovieRef : undefined}
        />
      ))}
    </div>
  );
}
