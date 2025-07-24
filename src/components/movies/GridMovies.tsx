import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { useEffect, useState } from 'react';
import { discoverMovies } from '../../services/movie.services';
import styles from '../../styles/movie.grid.module.scss';
import { Movie } from '../../types/movie.types';
import MovieCard from './MovieCard';
import MovieFilters from './MovieFilters';

export default function GridMovies({ active }: { active: boolean }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    selectedGenres,
    toggleGenre,
    rate,
    toggleRate: baseToggleRate,
  } = useMovieFilters();

  const filtersKey = selectedGenres.sort().join(',') + `-${rate}`;

  // Reset movies when filters change
  useEffect(() => {
    if (!active) return;
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [filtersKey, active]);

  // Fetch movies when page or filters change
  useEffect(() => {
    if (!active) return;
    const fetchMovies = async () => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const data = await discoverMovies(
          selectedGenres.length ? selectedGenres : [],
          rate,
          page
        );

        setMovies((prevMovies) => {
          const movieSet = new Set(prevMovies.map((m) => m.id));
          const newMovies = data.results.filter(
            (movie) => !movieSet.has(movie.id)
          );
          return page === 1 ? newMovies : [...prevMovies, ...newMovies];
        });

        setHasMore(data.results.length > 0);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, filtersKey, active]);

  const lastMovieRef = useInfiniteScroll(loading, hasMore, () =>
    setPage((prev) => prev + 1)
  );

  const enhancedToggleRate = (newRate: number) => {
    baseToggleRate(newRate);
  };

  const enhancedToggleGenre = (id: number) => {
    toggleGenre(id);
  };

  return (
    <div className={styles.container_grid}>
      <MovieFilters
        genres={selectedGenres}
        toggleGenre={enhancedToggleGenre}
        rate={rate}
        toggleRate={enhancedToggleRate}
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