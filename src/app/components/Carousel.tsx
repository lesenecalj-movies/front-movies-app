import React, { useRef, useEffect, useState } from "react";

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

  const updateItemsPerPage = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    if (width < 576) setItemsPerPage(1); // xs
    else if (width < 768) setItemsPerPage(2); // sm
    else if (width < 992) setItemsPerPage(3); // md
    else if (width < 1200) setItemsPerPage(4); // lg
    else if (width < 1400) setItemsPerPage(5); // xl
    else setItemsPerPage(6);
  };

  useEffect(() => {
    updateItemsPerPage();

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateItemsPerPage();
    });
    resizeObserver.observe(container);

    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const targetItem = itemRefs.current[index];
    if (targetItem && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: targetItem.offsetLeft,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - itemsPerPage);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const maxIndex = movies.length - itemsPerPage;
    const newIndex = Math.min(currentIndex + itemsPerPage, maxIndex);
    scrollToIndex(newIndex);
  };

  const itemStyle = {
    flex: `0 0 ${100 / itemsPerPage}%`,
    scrollSnapAlign: "start",
    alignSelf: "center",
    justifyItems: "center",
    padding: "0 0.5rem",
    boxSizing: "border-box" as const,
  };

  return (
    <div ref={containerRef} style={{ padding: "1rem", width: "100%" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
        }}
      >
        Popular Movies
      </h2>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <button onClick={handlePrev} style={navButtonStyle("left")}>
          &#8249;
        </button>

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "hidden",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            width: "100%",
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              ref={(el) => (itemRefs.current[index] = el)}
              style={itemStyle}
            >
              <img
                src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                alt={movie.title}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <p
                style={{
                  marginTop: "0.5rem",
                  textAlign: "center",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                {movie.title}
              </p>
            </div>
          ))}
        </div>

        <button onClick={handleNext} style={navButtonStyle("right")}>
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
  cursor: "pointer",
});

export default NetflixCarousel;
