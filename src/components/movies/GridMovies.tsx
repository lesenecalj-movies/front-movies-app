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

  useEffect(() => {
    if (!active) return;

    const fetchInitialMovies = async () => {
      setLoading(true);
      try {
        const data = await discoverMovies(
          selectedGenres.length ? selectedGenres : [],
          rate,
          1
        );
        setMovies(data.results);
        setHasMore(data.results.length > 0);
        setPage(1);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
  }, [filtersKey, active]);

  // Scroll infini quand page > 1
  useEffect(() => {
    if (!active || page === 1 || loading || !hasMore) return;

    const fetchMoreMovies = async () => {
      setLoading(true);
      try {
        const data = await discoverMovies(
          selectedGenres.length ? selectedGenres : [],
          rate,
          page
        );
        setMovies((prev) => {
          const prevIds = new Set(prev.map((m) => m.id));
          const newMovies = data.results.filter((m) => !prevIds.has(m.id));
          return [...prev, ...newMovies];
        });
        setHasMore(data.results.length > 0);
      } catch (error) {
        console.error('Error loading more movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreMovies();
  }, [page, active]);

  const lastMovieRef = useInfiniteScroll(loading, hasMore, () =>
    setPage((prev) => prev + 1)
  );

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