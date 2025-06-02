import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/movie.carousel.module.scss";
import { Movie } from "./interfaces/movie.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MoviePreview from "./moviePreview";

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
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [fullyVisibleIds, setFullyVisibleIds] = useState<Set<number>>(
    new Set()
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setItemRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
      observer.current?.observe(el);
    } else {
      itemRefs.current.delete(id);
    }
  };

  // ✅ Intersection Observer to track visibility
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        setFullyVisibleIds((prev) => {
          const updated = new Set(prev);
          entries.forEach((entry) => {
            const el = entry.target as HTMLDivElement;
            const id = Number(el.dataset.id);
  
            if (entry.intersectionRatio === 1) {
              updated.add(id);
            } else {
              updated.delete(id);
            }
          });
          return updated;
        });
      },
      {
        root: containerRef.current,
        threshold: 0.99, // only when fully visible
      }
    );

    // Observe already mounted items
    itemRefs.current.forEach((el) => observer.current?.observe(el));

    return () => observer.current?.disconnect();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const visibleItems = Math.floor(container.offsetWidth / (itemWidth + gap));
    const scrollAmount = visibleItems * (itemWidth + gap);
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Force a visibility recheck
    setTimeout(() => {
      itemRefs.current.forEach((el) => {
        observer.current?.unobserve(el);
        observer.current?.observe(el);
      });
    }, 400); // Give time for smooth scroll to settle
  };

  const handleMouseEnter = (movie: Movie, e: React.MouseEvent) => {
    if (!fullyVisibleIds.has(movie.id)) return;

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
      <button
        className={`${styles.carousel_button} ${styles.left}`}
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft size={32} />
      </button>

      <div
        className={styles.carousel_wrapper}
        ref={containerRef}
        style={{ gap: `${gap}px` }}
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

      <button
        className={`${styles.carousel_button} ${styles.right}`}
        onClick={() => handleScroll("right")}
      >
        <ChevronRight size={32} />
      </button>

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
