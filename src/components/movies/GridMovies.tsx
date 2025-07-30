import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const activeGenres = useMemo(() => {
    return selectedGenres.length ? selectedGenres : [];
  }, [selectedGenres]);

  const filtersKey = useMemo(() => {
    return [...selectedGenres].sort().join(',') + `-${rate}`;
  }, [selectedGenres, rate]);

  const fetchMovies = useCallback(
    async (page: number) => {
      if (loading) return;

      setLoading(true);
      try {
        const data = await discoverMovies(activeGenres, rate, page);
        const results = data.results || [];

        if (page === 1) {
          setMovies(results);
          setHasMore(results.length > 0);
          return;
        }

        if (results.length === 0) {
          setHasMore(false);
          return;
        }

        setMovies((prev) => {
          const prevIds = new Set(prev.map((m) => m.id));
          const newMovies = results.filter((m) => !prevIds.has(m.id));
          return [...prev, ...newMovies];
        });

        setHasMore(true);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    },
    [activeGenres, rate],
  );

  useEffect(() => {
    if (!active) return;
    setPage(1);
  }, [filtersKey, active]);

  // Scroll infini when page > 1
  useEffect(() => {
    if (!active || !hasMore) return;
    fetchMovies(page);
  }, [page, active, hasMore]);

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const lastMovieRef = useInfiniteScroll(loading, hasMore, loadMore);

  return (
    <div className={styles.container_grid}>
      <MovieFilters
        genres={selectedGenres}
        toggleGenre={toggleGenre}
        rate={rate}
        toggleRate={baseToggleRate}
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
