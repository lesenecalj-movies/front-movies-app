import React from "react";
import styles from "../../styles/movie.carousel.module.scss";
import { Movie } from "./interfaces/movie.types";

interface NetflixCarouselProps {
  movies: Movie[];
  itemWidth?: number;
  gap?: number;
}

const NetflixCarousel: React.FC<NetflixCarouselProps> = ({
  movies,
  itemWidth = 199,
  gap = 5,
}) => {

  return (
    <div className={styles.carousel_container}>
      <div
        className={styles.carousel_wrapper}
        style={{
          gap: `${gap}px`,
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={styles.carousel_item}
            style={{
              minWidth: `${itemWidth}px`,
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              className={styles.movie_poster}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetflixCarousel;