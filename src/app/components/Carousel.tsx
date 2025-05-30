import React, { useRef } from "react";
import styles from "../../styles/movie.carousel.module.scss";
import { Movie } from "./interfaces/movie.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const visibleItems = Math.floor(container.offsetWidth / (itemWidth + gap));
    const scrollAmount = visibleItems * (itemWidth + gap);

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
        <ChevronLeft size={32} />
      </button>

      <div
        ref={carouselRef}
        className={styles.carousel_wrapper}
        style={{ gap: `${gap}px` }}
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

      <button
        className={`${styles.carousel_button} ${styles.right}`}
        onClick={() => handleScroll("right")}
      >
        <ChevronRight size={32} />
      </button>

    </div>
  );
};

export default NetflixCarousel;