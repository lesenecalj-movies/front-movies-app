"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/movies.module.css";
import MovieCard from "../components/MovieCard";
import Image from "next/image";

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
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);
  const [page, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "categories">("grid");

  useEffect(() => {
    fetchPopularMovies();
    fetchDiscoverMovies();
  }, []);

  const fetchDiscoverMovies = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/movies/trending");
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data: {
        page: number;
        results: Movie[];
        total_pages: number;
        total_results: number;
      } = await res.json();
      setDiscoverMovies(() => {
        const sortedMovies = data.results.sort((a, b) => {
          return b.popularity - a.popularity;
        });
        return sortedMovies;
      });
    } catch (error) {
      console.error("Error fetching discover movies:", error);
    }
  }, []);

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
    <div className={styles.container}>
      <main>
        <h1>Trending Movies 🎬</h1>
        {/* Toggle entre les modes */}

        {/* Boutons d'affichage */}
        <div className={styles.display}>
          <button onClick={() => setViewMode("grid")}>
            <Image src="/icons/grid.png" alt="Grille" width={24} height={24} />
          </button>
          <button onClick={() => setViewMode("categories")}>
            <Image
              src="/icons/menu.png"
              alt="Catégories"
              width={24}
              height={24}
            />
          </button>
        </div>
        {viewMode === "grid" && (
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
        )}

        {viewMode === "categories" && (
          <div className={styles.grid}>
            {discoverMovies.map((movie: Movie, index: number) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                lastMovieRef={
                  index === movies.length - 1 ? lastMovieRef : undefined
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
