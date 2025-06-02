import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/movie.carousel.module.scss";
import { Movie } from "./interfaces/movie.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MoviePreview from "./moviePreview";

interface NetflixCarouselProps {
  movies: Movie[];
  itemWidth?: number;
  gap?: number;
  visibleItemCount?: number;
}

const NetflixCarousel: React.FC<NetflixCarouselProps> = ({
  movies,
  itemWidth = 199,
  gap = 10,
}) => {
  const [visibleItemCount, setVisibleItemCount] = useState(5);
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setItemRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  };

  useEffect(() => {
    updateVisibleItemCount();
    window.addEventListener("resize", updateVisibleItemCount);
    return () => window.removeEventListener("resize", updateVisibleItemCount);
  }, []);

  const updateVisibleItemCount = () => {
    if (!containerRef.current) return;

    const fullWidth = containerRef.current.offsetWidth;
    const totalItemWidth = itemWidth + gap;

    const count = Math.floor((fullWidth + gap) / totalItemWidth); // ensure full items only

    const newContainerWidth = count * totalItemWidth - gap; // total width of fully visible items
    setVisibleItemCount(count);
    setContainerWidth(newContainerWidth);
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = visibleItemCount * (itemWidth + gap);
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseEnter = (movie: Movie, e: React.MouseEvent) => {
    if (movie !== hoveredMovie) {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      setHoveredMovie(movie);
      setPreviewPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const handleMouseLeave = (movie: Movie) => {
    if (movie !== hoveredMovie) {
      setHoveredMovie(null);
      setPreviewPosition(null);
    }
  };

  return (
    <div className={styles.carousel_container}>
      <div className={styles.container_carousel_buton}>
        <button
          className={`${styles.carousel_button} ${styles.left}`}
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft size={32} />
        </button>
      </div>
      <div
        className={styles.carousel_wrapper}
        ref={containerRef}
        style={{
          gap: `${gap}px`,
          width: containerWidth ? `${containerWidth}px` : "100%",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            data-id={movie.id}
            className={styles.carousel_item}
            ref={setItemRef(movie.id)}
            onMouseEnter={(e) => handleMouseEnter(movie, e)}
            onMouseLeave={() => handleMouseLeave(movie)}
            style={{ minWidth: `${itemWidth}px`, flexShrink: 0 }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
              alt={movie.title}
              className={styles.movie_poster}
            />
          </div>
        ))}
      </div>

      <div className={styles.container_carousel_buton}>
        <button
          className={`${styles.carousel_button} ${styles.right}`}
          onClick={() => handleScroll("right")}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {hoveredMovie && previewPosition && (
        <div
          className={styles.preview_container}
          style={{
            position: "absolute",
            top: `${previewPosition.top + window.scrollY - 150}px`, // Adjust the offset as needed
            left: `${previewPosition.left + previewPosition.width / 2}px`,
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <MoviePreview movie={hoveredMovie} onClose={handleMouseLeave} />
        </div>
      )}
    </div>
  );
};

export default NetflixCarousel;
