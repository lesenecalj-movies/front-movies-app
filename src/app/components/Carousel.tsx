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
  gap = 10,
}) => {
  const [fullyVisibleIds, setFullyVisibleIds] = useState<Set<number>>(
    new Set()
  );

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [visibleItemCount, setVisibleItemCount] = useState(5);
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const setItemRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  };

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = new Set(fullyVisibleIds); // clone previous visible set

        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const id = Number(target.dataset.id);

          if (entry.intersectionRatio >= 1) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        });

        setFullyVisibleIds(visible);
      },
      {
        root: containerRef.current,
        threshold: 1.0,
      }
    );

    itemRefs.current.forEach((el) => observer.current?.observe(el));

    return () => observer.current?.disconnect();
  }, [movies, fullyVisibleIds]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      const containerWidth = container.offsetWidth;
      const totalItemWidth = itemWidth + gap;

      const count = Math.floor((containerWidth + gap) / totalItemWidth);
      const adjustedWidth = count * totalItemWidth - gap;

      setVisibleItemCount(count);
      setContainerWidth(adjustedWidth);

      itemRefs.current.forEach((el) => {
        observer.current?.unobserve(el);
        observer.current?.observe(el);
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [itemWidth, gap]);

  const handleScroll = (direction: "left" | "right") => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const scrollAmount = visibleItemCount * (itemWidth + gap);
    wrapper.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseEnter = (movie: Movie, e: React.MouseEvent) => {
    if (!fullyVisibleIds.has(movie.id)) {
      return;
    }

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
    <div className={styles.carousel_container} ref={containerRef}>
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
        ref={wrapperRef}
        style={{
          gap: `${gap}px`,
          width: containerWidth ? `${containerWidth}px` : "100%",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {(movies).map((movie) => (
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
            top: `${previewPosition.top + window.scrollY - 150}px`,
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
