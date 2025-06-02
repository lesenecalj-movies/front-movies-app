import React from "react";
import styles from "../../styles/movie.preview.module.scss";
import { Movie } from "./interfaces/movie.types";

interface Props {
  movie: Movie;
  onClose: () => void;
}

const MoviePreview: React.FC<Props> = ({ movie, onClose }) => {
  return (
    <div
      className={styles.preview}
      onMouseLeave={onClose}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
      />
      <div className={styles.info}>
        <h4>{movie.title}</h4>
      </div>
    </div>
  );
};

export default MoviePreview;