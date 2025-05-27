// NetflixCarousel.tsx
import React, { useState } from "react";
import "../../styles/movie.carousel.module.css";
import { Movie } from "./interfaces/movie.types";


interface NetflixCarouselProps {
  movies: Movie[];
  itemsPerPage?: number;
}

const NetflixCarousel: React.FC<NetflixCarouselProps> = ({ movies, itemsPerPage = 10 }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const startIndex = page * itemsPerPage;

  return (
    <div className="carousel-container">
      <button
        className="carousel-button left"
        onClick={handlePrev}
        disabled={page === 0}
      >
        ◀
      </button>

      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${startIndex * 210}px)` }} // 200px + margin
        >
          {movies.map((movie) => (
            <div className="carousel-item" key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} />
            </div>
          ))}
        </div>
      </div>

      <button
        className="carousel-button right"
        onClick={handleNext}
        disabled={page >= totalPages - 1}
      >
        ▶
      </button>
    </div>
  );
};

export default NetflixCarousel;