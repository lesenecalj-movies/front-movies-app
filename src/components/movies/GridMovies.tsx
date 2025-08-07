'use client';

import { useDiscoverMovies } from '@/hooks/useDiscoverMovies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { getMovieDetails } from '@/services/movie.services';
import { useCallback, useEffect, useState } from 'react';
import styles from '../../styles/movie.grid.module.scss';
import { Movie, MovieDetails } from '../../types/movie.types';
import MovieCard from './MovieCard';
import MovieFilters from './MovieFilters';
import MoviePreviewCard from './MoviePreviewCard';
import { usePreviewHover } from '@/hooks/usePreviewHover';

export default function GridMovies({ active }: { active: boolean }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  const {
    hoveredItem,
    previewPosition,
    content,
    isPreviewExiting,
    isPreviewOpen,
    handleHover,
    handleUnhover,
    cancelUnhover,
  } = usePreviewHover<Movie, MovieDetails>({
    fetchData: getMovieDetails,
  });

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

  const loadNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const lastMovieRef = useInfiniteScroll(isFetching, hasMore, loadNextPage);

  return (
    <div className={styles.container_grid}>
      <MovieFilters
        genres={selectedGenres}
        toggleGenre={toggleGenre}
        rate={rate}
        toggleRate={baseToggleRate}
      />
      <div className={styles.grid}>
        {movies.map((movie, index) => {
          const isLast = index === movies.length - 1;
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              lastMovieRef={isLast ? lastMovieRef : undefined}
              onHover={handleHover}
              onUnhover={handleUnhover}
              cancelUnhover={cancelUnhover}
            />
          );
        })}
      </div>

      {hoveredItem && previewPosition && content && (
        <MoviePreviewCard
          movie={{
            title: hoveredItem.title,
            posterPath: hoveredItem.poster_path,
            trailerUrl: 'https://www.youtube.com/embed/hrszT45oVm4', // temporaire
            runtime: content.runtime,
            genres: content.genres,
          }}
          position={previewPosition}
          onClose={handleUnhover}
          onMouseEnter={cancelUnhover}
          onMouseLeave={handleUnhover}
          isPreviewExiting={isPreviewExiting}
          isPreviewOpen={isPreviewOpen}
        />
      )}
    </div>
  );
}
