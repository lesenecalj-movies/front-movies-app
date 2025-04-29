import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/movies.module.scss";
import MovieCard from "./MovieCard";
import { Movie } from "./interfaces/movie.types";

export default function CategoriesMovieDisplay({ active }: { active: boolean }) {
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchDiscoverMovies();
  }, [active]);

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

  return (
    <div className={styles.grid}>
    {discoverMovies.map((movie: Movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
      />
    ))}
  </div>
  )
};