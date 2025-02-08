"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/movies.module.css";
import MovieCard from "../components/MovieCard";

type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = useCallback(async () => {
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
      console.error("Error fetching movies:", error);
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
            fetchMovies();
          }
        },
        { rootMargin: "100px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, fetchMovies]
  );

  return (
    <div className={styles.container}>
      <main>
        <h1>Popular Movies 🎬</h1>
        <div className={styles.grid}>
          {movies.map((movie: Movie, index: number) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              lastMovieRef={
                index === movies.length - 1 ? lastMovieRef : undefined
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
