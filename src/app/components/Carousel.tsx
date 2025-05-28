import React, { useRef } from "react";
import styles from "../../styles/movie.carousel.module.scss";
import { Movie } from "./interfaces/movie.types";

interface NetflixCarouselProps {
  movies: Movie[];
  itemWidth?: number;
  gap?: number;
}

const NetflixCarousel: React.FC<NetflixCarouselProps> = ({
  movies,
  itemWidth = 210,
  gap = 10,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = (itemWidth + gap) * 5; // scroll by 2 items at a time
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.carousel_container}>
      <button
        className={`${styles.carousel_button} ${styles.left}`}
        onClick={() => handleScroll("left")}
      >
        ◀
      </button>

      <div
        className={styles.carousel_wrapper}
        ref={containerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          gap: `${gap}px`,
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={styles.carousel_item}
            style={{ minWidth: `${itemWidth}px`, flexShrink: 0 }}
          >
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>

      <button
        className={`${styles.carousel_button} ${styles.right}`}
        onClick={() => handleScroll("right")}
      >
        ▶
      </button>
    </div>
  );
};

export default NetflixCarousel;