import Image from 'next/image';
import styles from '../../styles/movie.card.module.scss';
import { useCallback, useEffect, useState } from 'react';
import {
  MovieDetails,
  MovieProps,
  MovieProvider,
} from '../../types/movie.types';
import { getFormattedRateAndTheme } from '@/lib/utils';
import { getMovieDetails, getMovieProviders } from '@/services/movie.services';

export default function MovieCard({ movie, lastMovieRef }: MovieProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetails>();
  const [movieProviders, setMovieProviders] =
    useState<{ name: string; logoPath: string }[]>();

  useEffect(() => {
    if (isHovered && !movieDetails) {
      fetchMovieDetails();
      fetchProviders();
    }
  }, [isHovered, movieDetails]);

  const getParentProviders = (flatrates: MovieProvider[]) => {
    const uniqProviders: { name: string; logoPath: string }[] = [];

    flatrates
      .sort((a, b) => a.display_priority - b.display_priority)
      .map((flatrate) => {
        const exists = uniqProviders.some((provider) =>
          flatrate.provider_name.startsWith(provider.name.substring(0, 3)),
        );
        if (!exists) {
          uniqProviders.push({
            name: flatrate.provider_name,
            logoPath: flatrate.logo_path,
          });
        }
      });
    return uniqProviders;
  };

  const fetchProviders = useCallback(async () => {
    if (!movie.id) return;

    try {
      const data = await getMovieProviders(movie.id);
      const flatrates =
        data.results && data.results['CA'] && data.results['CA'].flatrate
          ? data.results['CA'].flatrate
          : [];
      if (flatrates) {
        setMovieProviders(getParentProviders(flatrates));
      }
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  }, [movie.id]);

  const fetchMovieDetails = useCallback(async () => {
    if (!movie.id) return;
    try {
      const data = await getMovieDetails(movie.id);
      setMovieDetails(data);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  }, [movie.id]);

  const [formattedRateMovie, themeMovie] = movie.vote_average
    ? getFormattedRateAndTheme(movie.vote_average)
    : [null, ''];

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.hovered : ''}`}
      ref={lastMovieRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {formattedRateMovie && Number(formattedRateMovie) > 0 && (
        <div className={styles.circle_container_rated}>
          <div
            className={`${styles.rating_circle} ${
              themeMovie ? styles[`rating_circle_${themeMovie}`] : ''
            }`}
          >
            <span className={styles.vote_average}>{formattedRateMovie}</span>
          </div>
        </div>
      )}

      <div className={styles.imageWrapper}>
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            alt={movie.title}
            fill
            className={styles.image}
            priority
          />
        ) : (
          <>{/* todo: handle the case where there isn't image. */}</>
        )}
      </div>

      {isHovered && (
        <div className={styles.movieDetails}>
          <div className={styles.genres_movie}>
            {movieDetails?.genres.map((genre, index) => (
              <span className={styles.genre} key={index}>
                {genre.name}
                {index < movieDetails.genres.length - 1 && (
                  <span className={styles.separator}>•</span>
                )}
              </span>
            ))}
          </div>
          <div className={styles.extra_details}>
            <div className={styles.runtime_movie}>
              {movieDetails?.runtime ? `${movieDetails.runtime} min` : 'N/A'}
            </div>
            <div className={styles.providers_info}>
              {movieProviders?.map(
                (
                  movieProvider: { name: string; logoPath: string },
                  index: number,
                ) => (
                  <div
                    className="provider"
                    key={`${index}_provider_${movie.id}_movie`}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${movieProvider.logoPath}`}
                      alt={movieProvider.name}
                      className={styles.provider_logo}
                      width="30"
                      height="30"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
