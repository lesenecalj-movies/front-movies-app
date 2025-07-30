'use client';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { useEffect, useState } from 'react';
import styles from '../../styles/movie.grid.module.scss';
import { Movie } from '../../types/movie.types';
import MovieCard from './MovieCard';
import MovieFilters from './MovieFilters';
import { useDiscoverMovies } from '@/hooks/useDiscoverMovies';

export default function GridMovies({ active }: { active: boolean }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  const {
    selectedGenres,
    toggleGenre,
    rate,
    toggleRate: baseToggleRate,
  } = useMovieFilters();

  const { data, isFetching } = useDiscoverMovies({
    genres: selectedGenres,
    rate,
    page,
  });

  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [selectedGenres, rate, active]);

  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      setMovies(data.results);
    } else {
      setMovies((prev) => {
        const prevIds = new Set(prev.map((m) => m.id));
        const newMovies = data.results.filter((m) => !prevIds.has(m.id));
        return [...prev, ...newMovies];
      });
    }
  }, [data, page]);

  const hasMore = !!data?.results.length;
  const lastMovieRef = useInfiniteScroll(isFetching, hasMore, () =>
    setPage((prev) => prev + 1),
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
