import { getFormattedRateAndTheme } from '@/lib/utils';
import { getMovieDetails, getMovieProviders } from '@/services/movie.services';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../../styles/movie.card.module.scss';
import {
  MovieDetails,
  MovieProps,
  MovieProvider,
} from '../../types/movie.types';

export default function MovieCard({ movie, lastMovieRef }: MovieProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetails>();
  const [movieProviders, setMovieProviders] =
    useState<{ name: string; logoPath: string }[]>();

  const [formattedRateMovie, themeMovie] = movie.vote_average
    ? getFormattedRateAndTheme(movie.vote_average)
    : [null, ''];

  useEffect(() => {
    if (!isHovered || movieDetails) return;

    const fetchData = async () => {
      try {
        const [details, providersData] = await Promise.all([
          getMovieDetails(movie.id),
          getMovieProviders(movie.id),
        ]);

        setMovieDetails(details);

        /** todo: define lang somewhere. */
        const flatrates = providersData?.results?.['CA']?.flatrate ?? [];
        setMovieProviders(getParentProviders(flatrates));
      } catch (error) {
        console.error('Failed to fetch movie data:', error);
      }
    };

    fetchData();
  }, [isHovered, movieDetails, movie.id]);

  const getParentProviders = (flatrates: MovieProvider[]) => {
    const uniqProviders: { name: string; logoPath: string }[] = [];

    flatrates
      .sort((a, b) => a.display_priority - b.display_priority)
      .forEach((flatrate) => {
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
