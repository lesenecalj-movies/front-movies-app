import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/movie.grid.module.scss";
import MovieCard from "./MovieCard";
import MovieFilters from "./MovieFilters";
import { Movie } from "./interfaces/movie.types";

export default function GridMovies({ active }: { active: boolean }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const selectedGenresKey = selectedGenres.sort((a, b) => a - b).join(",");
  const [rate, setRate] = useState<number>(50);

  useEffect(() => {
    if (!active) return;
    setMovies([]);
    setHasMore(true);
    setNextPage(1);
  }, [selectedGenresKey, rate, active]);

  useEffect(() => {
    if (!active) return;
    fetchPopularMovies(selectedGenres, rate, page);
  }, [page, selectedGenresKey, rate, active]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id)
        ? prev.filter((genreId) => genreId !== id)
        : [...prev, id]
    );
  };

  const toggleRate = (newRate: number) => {
    setHasMore(true);
    setNextPage(1);
    setRate(newRate);
    setMovies([]);
  };

  const fetchPopularMovies = useCallback(
    async (genres: number[], rate: number, page: number) => {
      if (loading || !hasMore) {
        return;
      }
      setLoading(true);

      const g = genres && genres.length > 0 ? genres : [];
      try {
        const res = await fetch(
          `http://localhost:3001/movies/discover?page=${page}&genres=${g}&rate=${rate}`
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

        setHasMore(data.results.length > 0);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setNextPage((prevPage) => prevPage + 1);
          }
        },
        { rootMargin: "300px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [hasMore, loading]
  );

  return (
    <div className={styles.container_grid}>
      <MovieFilters
        genres={selectedGenres}
        toggleGenre={toggleGenre}
        rate={rate}
        toggleRate={toggleRate}
      />

      <div className={styles.grid}>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            lastMovieRef={
              index === movies.length - 1 ? lastMovieRef : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
