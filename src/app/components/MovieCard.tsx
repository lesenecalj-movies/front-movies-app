import Image from "next/image";
import styles from "../../styles/movie.card.module.css";
import { useCallback, useEffect, useState } from "react";

type MovieDetails = {
  runtime: number;
};

type MovieProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    popularity: number;
    vote_average: number;
  };
  lastMovieRef?: (node: HTMLDivElement | null) => void; // Optional ref for infinite scrolling
}

export default function MovieCard({ movie, lastMovieRef }: MovieProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetails>();
  const [movieProviders, setMovieProviders] =
    useState<{ name: string; logoPath: string }[]>();

  // Fetch details only when hovering
  useEffect(() => {
    if (isHovered && !movieDetails) {
      getMovieDetails();
      getProviders();
    }
  }, [isHovered, movieDetails]);

  const getParentProviders = (flatrates: MovieProvider[]) => {
    const uniqProviders: { name: string; logoPath: string }[] = [];

    flatrates
      .sort((a, b) => a.display_priority - b.display_priority)
      .map((flatrate) => {
        const exists = uniqProviders.some((provider) =>
          flatrate.provider_name.startsWith(provider.name.substring(0, 3))
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

  const getFormattedRateAndTheme = (value: number) => {
    const percentage = (value / 10) * 100;
    const decimalPart = percentage - Math.floor(percentage);

    const result =
      decimalPart < 0.5 ? Math.floor(percentage) : Math.ceil(percentage);
    const theme =
      result >= 70
        ? "great_movie"
        : result <= 45
        ? "bad_movie"
        : "medium_movie";
    return [result, theme];
  };

  const getProviders = useCallback(async () => {
    if (!movie.id) return;

    try {
      const res = await fetch(
        `http://localhost:3001/movies/${movie.id}/providers`
      );
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();

      const flatrates: MovieProvider[] =
        data.results && data.results["CA"] && data.results["CA"].flatrate
          ? data.results["CA"].flatrate
          : [];
      if (!flatrates) {
        setMovieProviders(getParentProviders(flatrates));
      }
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  }, [movie.id]);

  const getMovieDetails = useCallback(async () => {
    if (!movie.id) return;

    try {
      const res = await fetch(`http://localhost:3001/movies/${movie.id}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data: MovieDetails = await res.json();
      setMovieDetails(data);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  }, [movie.id]);

  const [formattedRateMovie, themeMovie] = movie.vote_average
    ? getFormattedRateAndTheme(movie.vote_average)
    : [null, ""];

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.hovered : ""}`}
      ref={lastMovieRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {movie.vote_average && parseInt(movie.vote_average.toString(), 10) > 0 && (
        <div className={styles.circle_container_rated}>
          <div className={`${styles.rating_circle} ${themeMovie ? styles[`rating_circle_${themeMovie}`] : ''}`}>
            <span className={styles.vote_average}>{formattedRateMovie}</span>
          </div>
        </div>
      )}

      <div className={styles.imageWrapper}>
        <Image
          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          alt={movie.title}
          fill
          className={styles.image}
          priority
        />
      </div>

      {isHovered && (
        <div className={styles.movieDetails}>
          <div className={styles.global_info}>
            <p className={styles.runtime_movie}>
              {movieDetails?.runtime ? `${movieDetails.runtime} min` : "N/A"}
            </p>
          </div>
          <div className={styles.providers_info}>
            {movieProviders?.map(
              (
                movieProvider: { name: string; logoPath: string },
                index: number
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
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
