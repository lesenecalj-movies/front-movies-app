import Image from "next/image";
import styles from "../../styles/movie.card.module.css";
import { useCallback, useEffect, useState } from "react";

type MovieDetails = {
  runtime: number;
};

/* type MovieProviders = {
  rent: MovieProvider[];
  buy: MovieProvider[];
  flatrate: MovieProvider[];
};
 */
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
  };
  lastMovieRef?: (node: HTMLDivElement | null) => void; // Optional ref for infinite scrolling
}

export default function MovieCard({ movie, lastMovieRef }: MovieProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetails>();
  const [movieProviders, setMovieProviders] = useState<string[]>();

  // Fetch details only when hovering
  useEffect(() => {
    if (isHovered && !movieDetails) {
      getMovieDetails();
      getProviders();
    }
  }, [isHovered, movieDetails]);

  const getProviders = useCallback(async () => {
    if (!movie.id) return;

    try {
      const res = await fetch(
        `http://localhost:3001/movies/${movie.id}/providers`
      );
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      /** define the country on the web page. */
      
      const uniqProviders: string[] = [];
      const flatrates: MovieProvider[] = data.results && data.results["CA"] && data.results["CA"].flatrate ? data.results["CA"].flatrate : [];
      for (const flatrate of flatrates) {
        const exists = uniqProviders.some(provider => 
          flatrate.provider_name.startsWith(provider.split(" ")[0])
        );
        if (!exists) {
          uniqProviders.push(flatrate.provider_name);
        }
      }
      setMovieProviders(uniqProviders);
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

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.hovered : ""}`}
      ref={lastMovieRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          <p>{movieDetails?.runtime ? `${movieDetails.runtime} min` : "N/A"}</p>
          {movieProviders?.map((movieProvider: string, index: number) => (
            <div key={index}>{movieProvider}</div>
          ))}
        </div>
      )}
    </div>
  );
}
