import Image from "next/image";
import styles from "../../styles/movie.card.module.css";

interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    popularity: number;
  };
  lastMovieRef?: (node: HTMLDivElement | null) => void; // Optional ref for infinite scrolling
}

export default function MovieCard({ movie, lastMovieRef }: MovieProps) {
  return (
    <div className={styles.card} ref={lastMovieRef}>
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={300}
        height={450}
        className={styles.image}
      />
      {movie.popularity}  
      <div className={styles.title}>{movie.title}</div>
    </div>
  );
}