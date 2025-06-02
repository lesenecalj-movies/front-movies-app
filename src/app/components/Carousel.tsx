import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import styles from "../../styles/movie.carousel.module.scss";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Props {
  movies: Movie[];
}

const NetflixCarousel = ({ movies }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateItemsPerPage = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    if (width < 576) setItemsPerPage(1); // xs
    else if (width < 768) setItemsPerPage(2); // sm
    else if (width < 992) setItemsPerPage(3); // md
    else if (width < 1200) setItemsPerPage(4); // lg
    else if (width < 1400) setItemsPerPage(5); // xl
    else setItemsPerPage(6);
  }, []);

  const debounce = (fn: () => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    };
  };

  useEffect(() => {
    updateItemsPerPage();

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateItemsPerPage();
    });
    resizeObserver.observe(container);

    const debouncedResize = debounce(updateItemsPerPage, 100);
    window.addEventListener("resize", debouncedResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedResize);
    };
  }, [updateItemsPerPage]);

  const scrollToIndex = useCallback((index: number) => {
    const targetItem = itemRefs.current[index];
    if (targetItem && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: targetItem.offsetLeft,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, []);

  const handlePrev = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - itemsPerPage);
    scrollToIndex(newIndex);
  }, [currentIndex, itemsPerPage, scrollToIndex]);

  const handleNext = useCallback(() => {
    const maxIndex = movies.length - itemsPerPage;
    const newIndex = Math.min(currentIndex + itemsPerPage, maxIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, itemsPerPage, movies.length, scrollToIndex]);

  const itemStyle = useMemo(
    () => ({
      flex: `0 0 ${100 / itemsPerPage}%`,
      scrollSnapAlign: "start",
      alignSelf: "center",
      justifyItems: "center",
      padding: "0 0.5rem",
      boxSizing: "border-box" as const,
    }),
    [itemsPerPage]
  );

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
  };

  return (
    <div ref={containerRef} className={styles.container_carousel}>
      <h2 className={styles.carousel_title}>Popular Movies</h2>

      <div className={styles.wrapper_carousel}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            ...navButtonStyle("left"),
            opacity: currentIndex === 0 ? 0.4 : 1,
            cursor: currentIndex === 0 ? "default" : "pointer",
          }}
          aria-label="Previous movies"
        >
          &#8249;
        </button>

        <div ref={scrollRef} className={styles.container_scroll}>
          {movies.map((movie, index) => (
            <div
              className={styles.carousel_item}
              key={movie.id}
              ref={setItemRef(index)}
              style={itemStyle}
            >
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                alt={movie.title || "Movie poster"}
                className={styles.img}
              />
              <p className={styles.description}>{movie.title}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex + itemsPerPage >= movies.length}
          style={{
            ...navButtonStyle("right"),
            opacity: currentIndex + itemsPerPage >= movies.length ? 0.4 : 1,
            cursor:
              currentIndex + itemsPerPage >= movies.length
                ? "default"
                : "pointer",
          }}
          aria-label="Next movies"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

const navButtonStyle = (side: "left" | "right") => ({
  position: "absolute" as const,
  [side]: 0,
  zIndex: 1,
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  fontSize: "1.5rem",
  width: "2.5rem",
  height: "2.5rem",
});

export default NetflixCarousel;
